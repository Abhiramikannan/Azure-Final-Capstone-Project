terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }

  # THIS IS THE CORRECT PLACE FOR THE BACKEND BLOCK
  backend "azurerm" {
    resource_group_name  = "abhi-resource-group"     # Ensure this is the RG name where your Storage Account is (for state)
    storage_account_name = "abhicapstonestorage"     # Ensure this is the exact SA name you created (for state)
    container_name       = "tfstate"                 # This is the container you created inside the SA
    key                  = "terraform.tfstate"       # The name of the state file blob
  }
}

provider "azurerm" {
  features {}
}

# Data source to get the current tenant ID (needed for Key Vault and identity access)
data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "myrg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_container_registry" "acr" {
  name                = "abhiacr1"
  resource_group_name = azurerm_resource_group.myrg.name
  location            = azurerm_resource_group.myrg.location
  sku                 = "Standard"
  admin_enabled       = true # Enable admin user for push/pull (consider service principals for prod)

  identity {
    type = "SystemAssigned" # ACR's identity can be SystemAssigned for its own operations
  }

  depends_on = [azurerm_resource_group.myrg]
}

# ==============================================================================================
# Virtual Networks and Subnets
# ==============================================================================================

# VNet 1 in Central India (Primary VNet for AKS)
resource "azurerm_virtual_network" "vnet1" {
  name                = "abhi-vnet1"
  address_space       = ["10.10.0.0/16"]
  location            = var.vnet1_location
  resource_group_name = var.resource_group_name

  depends_on = [azurerm_resource_group.myrg]
}

resource "azurerm_subnet" "vnet1_subnet1" {
  name                 = "abhi-vnet1-subnet1" # Subnet for AKS default node pool
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet1.name
  address_prefixes     = ["10.10.1.0/24"]

  depends_on = [azurerm_virtual_network.vnet1]
}

resource "azurerm_subnet" "vnet1_subnet2" {
  name                 = "abhi-vnet1-subnet2" # Subnet for AKS user node pool
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet1.name
  address_prefixes     = ["10.10.2.0/24"]

  depends_on = [azurerm_virtual_network.vnet1]
}

# VNet 2 in West Europe (Secondary VNet for AKS)
resource "azurerm_virtual_network" "vnet2" {
  name                = "abhi-vnet2"
  address_space       = ["10.20.0.0/16"]
  location            = var.vnet2_location
  resource_group_name = var.resource_group_name

  depends_on = [azurerm_resource_group.myrg]
}

resource "azurerm_subnet" "vnet2_subnet1" {
  name                 = "abhi-vnet2-subnet1" # Subnet for AKS default node pool
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet2.name
  address_prefixes     = ["10.20.1.0/24"]

  depends_on = [azurerm_virtual_network.vnet2]
}

resource "azurerm_subnet" "vnet2_subnet2" {
  name                 = "abhi-vnet2-subnet2" # Subnet for AKS user node pool
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet2.name
  address_prefixes     = ["10.20.2.0/24"]

  depends_on = [azurerm_virtual_network.vnet2]
}

# ==============================================================================================
# User Assigned Managed Identity (Used by AKS to access Key Vaults)
# This identity needs to be created BEFORE AKS clusters are configured to use it.
# ==============================================================================================
resource "azurerm_user_assigned_identity" "aks_kv_identity" {
  resource_group_name = azurerm_resource_group.myrg.name
  location            = var.location # Can stay in the primary location or a common one
  name                = "abhi-aks-kv-identity"
}


# ==============================================================================================
# AKS Clusters (NOW CORRECTLY USING User Assigned Identity for Key Vault access)
# ==============================================================================================

resource "azurerm_kubernetes_cluster" "aks" {
  name                = "abhiaks1"
  location            = var.vnet1_location
  resource_group_name = var.resource_group_name
  dns_prefix          = "abhiaks1"

  default_node_pool {
    name           = "primarynp1"
    node_count     = 1
    vm_size        = "Standard_B2s"
    vnet_subnet_id = azurerm_subnet.vnet1_subnet1.id
  }

  # **CRITICAL FIX APPLIED HERE**
  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.aks_kv_identity.id]
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
    network_policy    = "azure"
  }

  # **CRITICAL DEPENDENCY ADDED HERE**
  depends_on = [
    azurerm_subnet.vnet1_subnet1,
    azurerm_user_assigned_identity.aks_kv_identity # Explicit dependency on the managed identity
  ]
}

resource "azurerm_kubernetes_cluster_node_pool" "usernp" {
  name                  = "primarynp2"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.aks.id
  vm_size               = "Standard_B2s"
  node_count            = 1
  mode                  = "User" # Defines this as a user node pool
  vnet_subnet_id        = azurerm_subnet.vnet1_subnet2.id
  orchestrator_version  = azurerm_kubernetes_cluster.aks.kubernetes_version

  depends_on = [azurerm_subnet.vnet1_subnet2]
}

resource "azurerm_kubernetes_cluster" "aks2" {
  name                = "abhi-aks2"
  location            = var.vnet2_location
  resource_group_name = var.resource_group_name
  dns_prefix          = "abhiaks2"

  default_node_pool {
    name           = "secondarynp1"
    node_count     = 1
    vm_size        = "Standard_B2s"
    vnet_subnet_id = azurerm_subnet.vnet2_subnet1.id
  }

  # **CRITICAL FIX APPLIED HERE**
  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.aks_kv_identity.id]
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
    network_policy    = "azure"
  }

  # **CRITICAL DEPENDENCY ADDED HERE**
  depends_on = [
    azurerm_subnet.vnet2_subnet1,
    azurerm_user_assigned_identity.aks_kv_identity # Explicit dependency on the managed identity
  ]
}

resource "azurerm_kubernetes_cluster_node_pool" "usernp2" {
  name                  = "secondarynp2"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.aks2.id
  vm_size               = "Standard_B2s"
  node_count            = 1
  mode                  = "User" # Defines this as a user node pool
  vnet_subnet_id        = azurerm_subnet.vnet2_subnet2.id
  orchestrator_version  = azurerm_kubernetes_cluster.aks2.kubernetes_version

  depends_on = [azurerm_subnet.vnet2_subnet2]
}

# ==============================================================================================
# Azure Key Vaults and Secrets (One per region for high availability)
# ==============================================================================================

# Key Vault for Central India (primary region)
resource "azurerm_key_vault" "kv_centralindia" {
  # IMPORTANT: Make these names highly unique to avoid "VaultAlreadyExists" errors!
  # Consider adding random strings or more specific identifiers.
  name                       = "abhi-kv-central-india" 
  location                   = var.vnet1_location # Uses the specific VNet location variable
  resource_group_name        = azurerm_resource_group.myrg.name
  sku_name                   = "standard"
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days = 7
  purge_protection_enabled   = true
}

# Key Vault for West Europe (secondary region)
resource "azurerm_key_vault" "kv_westeurope" {
  # IMPORTANT: Make these names highly unique to avoid "VaultAlreadyExists" errors!
  # Consider adding random strings or more specific identifiers.
  name                       = "abhi-kv-west-us" 
  location                   = var.vnet2_location # Uses the specific VNet location variable
  resource_group_name        = azurerm_resource_group.myrg.name
  sku_name                   = "standard"
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days = 7
  purge_protection_enabled   = true
}

# IMPORTANT: These access policies grant the IDENTITY RUNNING THIS TERRAFORM
# permissions to manage secrets in your Key Vaults.
# The 'object_id' below is taken from the 'oid' in your previous error message.

resource "azurerm_key_vault_access_policy" "kv_access_for_terraform_executor_centralindia" {
  key_vault_id = azurerm_key_vault.kv_centralindia.id
  tenant_id    = data.azurerm_client_config.current.tenant_id

  # THIS IS YOUR OBJECT ID FROM THE PREVIOUS ERROR MESSAGE
  # 'oid=3cb026dd-3f46-470c-b65c-e0bd92d4fd19'
  object_id    = "1c6ad34d-73d1-4c1a-b38d-735be951325d" 

  # Permissions needed for Terraform to 'Get', 'List', 'Set' (create/update), and 'Delete' secrets
  secret_permissions = ["Get", "List", "Set", "Delete"]

  depends_on = [
    azurerm_key_vault.kv_centralindia
  ]
}

resource "azurerm_key_vault_access_policy" "kv_access_for_terraform_executor_westeurope" {
  key_vault_id = azurerm_key_vault.kv_westeurope.id
  tenant_id    = data.azurerm_client_config.current.tenant_id

  # THIS IS YOUR OBJECT ID FROM THE PREVIOUS ERROR MESSAGE
  # 'oid=3cb026dd-3f46-470c-b65c-e0bd92d4fd19'
  object_id    = "1c6ad34d-73d1-4c1a-b38d-735be951325d"

  secret_permissions = ["Get", "List", "Set", "Delete"]

  depends_on = [
    azurerm_key_vault.kv_westeurope
  ]
}
# Secrets for Key Vault in Central India
resource "azurerm_key_vault_secret" "db_username_secret_centralindia" {
  name         = "DbUsername"
  value        = var.db_username
  key_vault_id = azurerm_key_vault.kv_centralindia.id
  content_type = "text/plain"
}

resource "azurerm_key_vault_secret" "db_password_secret_centralindia" {
  name         = "DbPassword"
  value        = var.db_password
  key_vault_id = azurerm_key_vault.kv_centralindia.id
  content_type = "text/plain"
}

# Secrets for Key Vault in West Europe
resource "azurerm_key_vault_secret" "db_username_secret_westeurope" {
  name         = "DbUsername"
  value        = var.db_username
  key_vault_id = azurerm_key_vault.kv_westeurope.id
  content_type = "text/plain"
}

resource "azurerm_key_vault_secret" "db_password_secret_westeurope" {
  name         = "DbPassword"
  value        = var.db_password
  key_vault_id = azurerm_key_vault.kv_westeurope.id
  content_type = "text/plain"
}

variable "resource_group_name" {
  description = "The name of the Resource Group"
  type        = string
  default     = "abhi-resource-group"
}
 
variable "location" {
  description = "Azure region where the Resource Group will be created"
  type        = string
  default     = "Central India"
}
 
variable "vnet1_location" {
  description = "Azure region for VNet1"
  type        = string
  default     = "Central India"
}
 
variable "vnet2_location" {
  description = "Azure region for VNet2"
  type        = string
  default     = "West Europe"
}
variable "db_username" {
  description = "The username for the database. This is a SENSITIVE value."
  type        = string
  sensitive   = true # Marks the variable as sensitive, preventing its value from being shown in CLI output
}

variable "db_password" {
  description = "The password for the database. This is a SENSITIVE value."
  type        = string
  sensitive   = true # Marks the variable as sensitive
}
 
