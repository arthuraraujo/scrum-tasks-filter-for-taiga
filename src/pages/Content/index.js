const currentUserName = document.querySelector(
  '.dropdown-user > div > div > a'
).innerText;

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

function createTopNavDropdown(usernames) {
  const navRight = document.querySelector('.nav-right');

  // Cria a estrutura HTML com os elementos necessários
  const topnavDropdownWrapper = document.createElement('div');
  topnavDropdownWrapper.className = 'topnav-dropdown-wrapper nav-bar-support';

  const a = document.createElement('a');
  a.href = '#';
  a.target = '_blank';
  a.title = 'Filtros';
  topnavDropdownWrapper.appendChild(a);

  const tgSvg = document.createElement('tg-svg');
  tgSvg.setAttribute('svg-icon', 'icon-filters');
  a.appendChild(tgSvg);

  const svg = document.createElement('svg');
  svg.className = 'icon icon-filters';
  svg.style.fill = ` `;
  tgSvg.appendChild(svg);

  const use = document.createElement('use');
  use.setAttribute('xlink:href', '#icon-filters');
  use.setAttribute('href', '#icon-filters');
  svg.appendChild(use);

  const navbarDropdown = document.createElement('div');
  navbarDropdown.className = 'navbar-dropdown navigation-help';
  topnavDropdownWrapper.appendChild(navbarDropdown);

  const ul = document.createElement('ul');
  navbarDropdown.appendChild(ul);

  // Cria os itens da lista com base no array de nomes de usuários
  usernames.forEach((username) => {
    const li = document.createElement('li');
    ul.appendChild(li);

    const userLink = document.createElement('a');
    userLink.href = '#';
    userLink.className = 'secondary';
    userLink.onclick = function (e) {
      e.preventDefault();
      hideTaskboardRows(username);
      hideTaskCards(username);
      return false;
    };
    li.appendChild(userLink);

    const userTgSvg = document.createElement('tg-svg');
    userTgSvg.setAttribute('svg-icon', 'icon-user');
    userLink.appendChild(userTgSvg);

    const userSvg = document.createElement('svg');
    userSvg.className = 'icon icon-user';
    userSvg.style.fill = ` `;
    userTgSvg.appendChild(userSvg);

    const userUse = document.createElement('use');
    userUse.setAttribute('xlink:href', '#icon-user');
    userUse.setAttribute('href', '#icon-user');
    userSvg.appendChild(userUse);

    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = username;
    userLink.appendChild(usernameSpan);
  });

  const comment = document.createComment('');
  //   navRight.appendChild(comment);
  navRight.insertBefore(comment, navRight.firstChild);

  // Insere o elemento criado como o primeiro elemento dentro da div nav-right
  navRight.insertBefore(topnavDropdownWrapper, comment);
}

function getUsersWithTasks() {
  const uniqueUserNames = new Set();
  const cardUserAvatars = document.querySelectorAll('.card-user-avatar img');
  cardUserAvatars.forEach((avatar) => {
    const title = avatar.getAttribute('title');
    uniqueUserNames.add(title);
  });
  const sortedUniqueNames = Array.from(uniqueUserNames).sort();
  return sortedUniqueNames;
}

const usersWithTasks = getUsersWithTasks();
createTopNavDropdown(usersWithTasks);

// console.log('ok');
// document.addEventListener('DOMContentLoaded', () => {
//   // Executa a função para ocultar as divs "taskboard-inner" sem a imagem "Arthur Araújo" quando a página estiver montada
//   // hideTaskboardRows();
//   // createDropdown()
//   console.log('DOM loaded');
//   const usersWithTasks = getUsersWithTasks();
//   createTopNavDropdown(usersWithTasks);
// });
