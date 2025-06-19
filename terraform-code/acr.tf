resource "azurerm_container_registry" "acr" {
  name                = "abhiacr1"
  resource_group_name = azurerm_resource_group.myrg.name
  location            = azurerm_resource_group.myrg.location
  sku                 = "Standard"
  admin_enabled       = true

  identity {
    type = "SystemAssigned"
  }
}
