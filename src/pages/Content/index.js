// ////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////
// Classes Observer, to later see if body has class loader-active
// ////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////
function observeClassChanges(element, callback) {
  const observerCallback = (mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        callback(element);
      }
    }
  };
  const config = { attributes: true, attributeFilter: ['class'] };
  const observer = new MutationObserver(observerCallback);
  observer.observe(element, config);
  // Return a function to disconnect the observer when needed
  return () => observer.disconnect();
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////
// Functions to verify if element exist and if the page is loading
// ////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////

function isTAIGA() {
  const body = document.querySelector('body');
  return body.hasAttribute('tg-main');
}

function isLoading() {
  const body = document.querySelector('body');
  return body.classList.contains('loader-active');
}

function isInTaskboard() {
  const taskboardSection = document.querySelector('section.main.taskboard');
  return !!taskboardSection;
}

function navExists() {
  const navRight = document.querySelector('.nav-right');
  return !!navRight;
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////
// DOM Manipulation Functions
// ////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////////////////////
// Remove Filter to avoid duplicates
// ////////////////////////////////////////////////////////////////////////////////////////////
function removeFilterIfItExists() {
  const filter = document.querySelector('.nav-right div > a[title="Filtros"]');
  if (filter) {
    filter.parentNode.removeChild(filter);
  }
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// Hide elements from Taskboard (TaskboardRows and cards)
// ////////////////////////////////////////////////////////////////////////////////////////////
function hideTaskboardRows(userName) {
  const taskboardRows = document.querySelectorAll('.taskboard-row');

  taskboardRows.forEach((row) => {
    row.style.display = 'flex';
    if (!userName) {
      return;
    }
    const hasTasksAssignedToSelectedUser = row.querySelector(
      `img[title="${userName}"]`
    );
    if (!hasTasksAssignedToSelectedUser) {
      row.style.display = 'none';
    }
  });
}

function hideTaskCards(userName) {
  const taskCards = document.querySelectorAll('tg-card');
  taskCards.forEach((card) => {
    card.style.display = 'block';
    if (!userName) {
      return;
    }
    const hasTasksAssignedToSelectedUser = card.querySelector(
      `img[title="${userName}"]`
    );
    if (!hasTasksAssignedToSelectedUser) {
      card.style.display = 'none';
    }
  });
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// Get TaskboardUsers and return an array of objects with name and src
// ////////////////////////////////////////////////////////////////////////////////////////////
function getUsersWithTasks() {
  try {
    const uniqueUserNames = new Set();
    const cardUserAvatars = document.querySelectorAll('.card-user-avatar img');
    cardUserAvatars.forEach((avatar) => {
      const title = avatar.getAttribute('title');
      const src = avatar.getAttribute('src');
      const backgroundColor = avatar.style?.backgroundColor || 'rgb(0,0,0)';
      uniqueUserNames.add(`${title} |  
    ${src} | ${backgroundColor}`);
    });

    console.log(`uniqueUserNames: ${uniqueUserNames}`);
    const sortedUniqueNames = Array.from(uniqueUserNames).sort();
    const usersArrayOfObjects = sortedUniqueNames.map((user) => {
      console.log(`user: ${user}`);
      const usersArray = user.split('|');
      return {
        name: usersArray[0],
        src: usersArray[1],
        backgroundColor: usersArray[2],
      };
    });
    return usersArrayOfObjects;
  } catch (e) {
    console.log('e1', e);
  }
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// Create the filter and insert it in the TopNav
// ////////////////////////////////////////////////////////////////////////////////////////////

function createTopNavDropdown(usersArrayOfObjects) {
  removeFilterIfItExists();
  const navRight = document.querySelector('.nav-right');

  // Cria a estrutura HTML com os elementos necessários
  const topnavDropdownWrapper = document.createElement('div');
  topnavDropdownWrapper.className = 'topnav-dropdown-wrapper nav-bar-support';

  const a = document.createElement('a');
  a.href = '#';
  a.target = '_blank';
  a.title = 'Filtros';
  a.onclick = function (e) {
    e.preventDefault();
    return false;
  };
  topnavDropdownWrapper.appendChild(a);

  const filterIconSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m17 21l1.8 1.77c.5.5 1.2.1 1.2-.49V18l2.8-3.4A1 1 0 0 0 22 13h-7c-.8 0-1.3 1-.8 1.6L17 18v3m-2-1H2v-3c0-2.7 5.3-4 8-4c.6 0 1.3.1 2.1.2c-.2.6-.1 1.3.1 1.9c-.7-.1-1.5-.2-2.2-.2c-3 0-6.1 1.5-6.1 2.1v1.1h10.6l.5.6V20M10 4C7.8 4 6 5.8 6 8s1.8 4 4 4s4-1.8 4-4s-1.8-4-4-4m0 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2Z"/></svg>
  `;

  a.insertAdjacentHTML('beforeend', filterIconSVG);

  const addAllUsersOptionToList = (ListElement) => {
    const li = document.createElement('li');
    ListElement.appendChild(li);

    const userLink = document.createElement('a');
    userLink.href = '#';
    userLink.className = 'secondary';
    userLink.onclick = function (e) {
      e.preventDefault();
      hideTaskboardRows();
      hideTaskCards();
      return false;
    };
    li.appendChild(userLink);

    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = '--- Ver todos ---';
    userLink.style.justifyContent = 'center';
    userLink.appendChild(usernameSpan);
  };

  const navbarDropdown = document.createElement('div');
  navbarDropdown.className = 'navbar-dropdown navigation-help';
  topnavDropdownWrapper.appendChild(navbarDropdown);

  const ul = document.createElement('ul');
  navbarDropdown.appendChild(ul);

  // Cria os itens da lista com base no array de nomes de usuários
  usersArrayOfObjects.forEach((userObject) => {
    const li = document.createElement('li');
    ul.appendChild(li);

    const userLink = document.createElement('a');
    userLink.href = '#';
    userLink.className = 'secondary';
    userLink.onclick = function (e) {
      e.preventDefault();
      hideTaskboardRows(userObject.name);
      hideTaskCards(userObject.name);
      return false;
    };
    li.appendChild(userLink);

    const avatar = document.createElement('img');
    try {
      if (userObject.backgroundColor) {
        avatar.style.backgroundColor = userObject.backgroundColor;
      }
    } catch (e) {
      console.log('e2', e);
    }
    avatar.src = userObject.src;
    avatar.style.width = '40px';
    avatar.style.height = '40px';
    avatar.style.borderRadius = '50%';
    avatar.style.marginRight = '10px';
    avatar.style.objectFit = 'cover';

    userLink.appendChild(avatar);

    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = userObject.name;
    userLink.appendChild(usernameSpan);
  });

  addAllUsersOptionToList(ul);

  const comment = document.createComment('');
  //   navRight.appendChild(comment);
  navRight.insertBefore(comment, navRight.firstChild);

  // Insere o elemento criado como o primeiro elemento dentro da div nav-right
  navRight.insertBefore(topnavDropdownWrapper, comment);
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////
// Add Filter only on the correct Taiga Page and only if the nav exists and is not loading
// ////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////
function addFilterIfInTaskboard() {
  if (isTAIGA() && !isLoading() && navExists()) {
    if (isInTaskboard()) {
      const usersWithTasks = getUsersWithTasks();
      createTopNavDropdown(usersWithTasks);
    } else {
      removeFilterIfItExists();
    }
  }
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////
// Run only if its a Taiga Webpaige
// ////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////
if (isTAIGA()) {
  // const observer = new MutationObserver(addFilterIfInTaskboard);
  // observer.observe(document.body, { subtree: true, childList: true });
  const body = document.querySelector('body');
  observeClassChanges(body, addFilterIfInTaskboard);
}
