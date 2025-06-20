terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }

  # THIS IS THE CORRECT PLACE FOR THE BACKEND BLOCK
  backend "azurerm" {
    resource_group_name  = "abhi-resource-group"    # Ensure this is the RG name where your Storage Account is (for state)
    storage_account_name = "abhicapstonestorage"   # Ensure this is the exact SA name you created (for state)
    container_name       = "tfstate"                # This is the container you created inside the SA
    key                  = "terraform.tfstate"      # The name of the state file blob
  }
 
}

provider "azurerm" {
  features {}
}
resource "azurerm_resource_group" "myrg" {
  name     = var.resource_group_name
  location = var.location
}
 
resource "azurerm_container_registry" "acr" {
  name                = "abhiacr1"
  resource_group_name = azurerm_resource_group.myrg.name
  location            = azurerm_resource_group.myrg.location
  sku                 = "Standard"
  admin_enabled       = true
 
  identity {
    type = "SystemAssigned"
  }
 
  depends_on = [azurerm_resource_group.myrg]
}
 
# VNet 1 in Central India (renamed abhi-vnet1)
resource "azurerm_virtual_network" "vnet1" {
  name                = "abhi-vnet1"
  address_space       = ["10.10.0.0/16"]
  location            = var.vnet1_location
  resource_group_name = var.resource_group_name
 
  depends_on = [azurerm_resource_group.myrg]
}
 
resource "azurerm_subnet" "vnet1_subnet1" {
  name                 = "abhi-vnet1-subnet1"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet1.name
  address_prefixes     = ["10.10.1.0/24"]
 
  depends_on = [azurerm_virtual_network.vnet1]
}
 
resource "azurerm_subnet" "vnet1_subnet2" {
  name                 = "abhi-vnet1-subnet2"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet1.name
  address_prefixes     = ["10.10.2.0/24"]
 
  depends_on = [azurerm_virtual_network.vnet1]
}
 
# VNet 2 in East US (renamed abhi-vnet2)
resource "azurerm_virtual_network" "vnet2" {
  name                = "abhi-vnet2"
  address_space       = ["10.20.0.0/16"]
  location            = var.vnet2_location
  resource_group_name = var.resource_group_name
 
  depends_on = [azurerm_resource_group.myrg]
}
 
resource "azurerm_subnet" "vnet2_subnet1" {
  name                 = "abhi-vnet2-subnet1"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet2.name
  address_prefixes     = ["10.20.1.0/24"]
 
  depends_on = [azurerm_virtual_network.vnet2]
}
 
resource "azurerm_subnet" "vnet2_subnet2" {
  name                 = "abhi-vnet2-subnet2"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet2.name
  address_prefixes     = ["10.20.2.0/24"]
 
  depends_on = [azurerm_virtual_network.vnet2]
}
 
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
 
  identity {
    type = "SystemAssigned"
  }
 
  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
    network_policy    = "azure"
  }
 
  depends_on = [azurerm_subnet.vnet1_subnet1]
}
 
resource "azurerm_kubernetes_cluster_node_pool" "usernp" {
  name                  = "primarynp2"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.aks.id
  vm_size               = "Standard_B2s"
  node_count            = 1
  mode                  = "User"
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
 
  identity {
    type = "SystemAssigned"
  }
 
  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
    network_policy    = "azure"
  }
 
  depends_on = [azurerm_subnet.vnet2_subnet1]
}
 
resource "azurerm_kubernetes_cluster_node_pool" "usernp2" {
  name                  = "secondarynp2"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.aks2.id
  vm_size               = "Standard_B2s"
  node_count            = 1
  mode                  = "User"
  vnet_subnet_id        = azurerm_subnet.vnet2_subnet2.id
  orchestrator_version  = azurerm_kubernetes_cluster.aks2.kubernetes_version
 
  depends_on = [azurerm_subnet.vnet2_subnet2]
}
resource "azurerm_cosmosdb_account" "mongodb_account" {
  name                = "abhi-db-cluster" # Must match the exact name of your database in Azure
  location            = var.location      # Or specific location variable if different
  resource_group_name = azurerm_resource_group.myrg.name
  offer_type          = "Standard"        # Or "Standard" / "Cassandra" / "Gremlin" / "Table"
  kind                = "MongoDB"         # Must be "MongoDB" as shown in your screenshot
  mongo_server_version = "4.0"           # Check your Cosmos DB settings in Azure for the exact version

  # You MUST add a consistency_policy block. Check your existing DB for its consistency level.
  # Example:
  consistency_policy {
    consistency_level       = "Session" # Common value, check your portal for exact
    # If consistency_level is "BoundedStaleness", add:
    # max_interval_in_seconds = 5
    # max_staleness_prefix    = 100
  }

  # Add geo_locations. If you only have one region, it will look like this:
  geo_location {
    location          = var.location # Or the primary region of your DB
    failover_priority = 0
  }

  # If you have firewall rules set up manually, you'll need to replicate them here
  # ip_range_filter = "0.0.0.0,10.0.0.0" # Example

  # If you enabled public access from Azure services (as suggested in one of your images)
  public_network_access_enabled = true # Or false if you use VNet integration

  # Any other properties configured in your existing database that are relevant
  # e.g., capabilities, backup, etc.
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
 
