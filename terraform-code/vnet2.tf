resource "azurerm_virtual_network" "vnet2" {
  name                = "abhi-vnet2"
  address_space       = ["10.20.0.0/16"]
  location            = var.vnet2_location
  resource_group_name = var.resource_group_name
}

resource "azurerm_subnet" "vnet2_subnet1" {
  name                 = "abhi-vnet2-subnet1"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet2.name
  address_prefixes     = ["10.20.1.0/24"]
}

resource "azurerm_subnet" "vnet2_subnet2" {
  name                 = "abhi-vnet2-subnet2"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet2.name
  address_prefixes     = ["10.20.2.0/24"]
}
