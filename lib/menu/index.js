document.querySelector('.Sidebar-left').addEventListener('click', function (event) {
    // console.log('hola')
    // localStorage.setItem('miGato', 'Juan');
})


var appContainer = document.querySelector('.app-container')
// appContainer.innerHTML = template()

// checkAccess('viewArticleList').then(res => {
//   console.log(res)
// })

appContainer.addEventListener('click', function (event) {
  if (event.target.parentNode.className === 'toggle-nav-left') {
    appContainer.classList.remove('show-nav-top', 'show-nav-right', 'show-nav-bottom')
    appContainer.classList.toggle('show-nav-left')
    // console.log('openn')
  }else{
      // console.log('closee')
  }
  if (event.target.parentNode.className === 'toggle-nav-right') {
    appContainer.classList.remove('show-nav-top', 'show-nav-right', 'show-nav-bottom')
    appContainer.classList.toggle('show-nav-right')
    event.preventDefault()
  }
})