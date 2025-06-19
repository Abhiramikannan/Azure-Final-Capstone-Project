resource "azurerm_virtual_network" "vnet1" {
  name                = "abhi-vnet1"
  address_space       = ["10.10.0.0/16"]
  location            = var.vnet1_location
  resource_group_name = var.resource_group_name
}

resource "azurerm_subnet" "vnet1_subnet1" {
  name                 = "abhi-vnet1-subnet1"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet1.name
  address_prefixes     = ["10.10.1.0/24"]
}

resource "azurerm_subnet" "vnet1_subnet2" {
  name                 = "abhi-vnet1-subnet2"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet1.name
  address_prefixes     = ["10.10.2.0/24"]
}
