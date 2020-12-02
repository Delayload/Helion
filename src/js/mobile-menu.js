document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector(".mobile-menu");
  const menu = document.querySelector(".header-menu__nav");
  const headerMenu = document.querySelector(".header-menu");
  const navLink =  document.querySelectorAll(".header-menu__nav-link");

  navLink.forEach(function(item){
    item.addEventListener('click', function(event) {
        event.preventDefault();
        if (this.classList.contains('nav-link--open')) {
          this.classList.remove("nav-link--open");
          this.nextElementSibling.classList.remove("submenu--open");
        }
        else {
          navLink.forEach(function(item){
            if (item.classList.contains('nav-link--open')) {
              item.classList.remove("nav-link--open");
              item.nextElementSibling.classList.remove("submenu--open");
            } 
          });
          this.classList.add("nav-link--open");
          this.nextElementSibling.classList.add("submenu--open");
        }
    });
  });

  button.addEventListener('click', function () {
      if (menu.classList.contains('mobile-menu--open')) {
          menu.classList.remove('mobile-menu--open');
          button.classList.remove('mobile-menu--open');
          headerMenu.classList.remove('header-menu--open')
      }
      else {
          menu.classList.add('mobile-menu--open');
          button.classList.add('mobile-menu--open');
          headerMenu.classList.add('header-menu--open')
      }
  })
});