const getMenus = (menus, userId) => {
  if(menus.length === 0) {
    return []
  }
  const response = menus.filter(menu => menu.owners.length ==0 || menu.owners.filter(owner => owner.id === userId).length > 0)
  return response
}

module.exports = {
  getMenus
}

