output "aks_primary_name" {
  value = azurerm_kubernetes_cluster.aks.name
}

output "aks_secondary_name" {
  value = azurerm_kubernetes_cluster.aks2.name
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}
