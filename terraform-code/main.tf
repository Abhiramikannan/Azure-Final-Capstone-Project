terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
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
