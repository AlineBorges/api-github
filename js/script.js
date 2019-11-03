const repositoryList = document.querySelector('.repository-list'),
      commit = document.querySelector('.box-commit'),
      body = document.querySelector('body');

let fork = document.querySelector('.box-number-forks'),
    star = document.querySelector('.box-number-stars');
    contribs = document.querySelector('.box-number-contribs');

body.addEventListener('click', (e) => {
    if (e.target.className === 'repository-link') {
        const activeItem = document.querySelector('.active');
        activeItem ? activeItem.classList.remove('active') : null;
        e.target.parentNode.classList.add('active');
        getRepositoryInfo(e.target.innerText);
    }
});

const getRepository = () => {
    let URL = "https://api.github.com/users/deezer/repos";
    fetch(URL)
        .then(response => response.json())
        .then(response => {
            response.forEach( r => {
                showRepository(r);
            });
        });
}

const getRepositoryInfo = (repository) => {
    let URL = `https://api.github.com/repos/deezer/${repository}`;
    fetch(URL)
        .then(response => response.json())
        .then(response => {
            getCommitList(repository);
            fork.innerHTML = response.forks_count;
            star.innerHTML = response.stargazers_count;
        });
}

const getCommitList = (repository) => {
    commit.innerHTML = '';
    let URL = `https://api.github.com/repos/deezer/${repository}/commits`;
    fetch(URL)
        .then(response => response.json())
        .then(response => {
            contribs.innerHTML = response.length;
            response.forEach(c => {
                showCommit(c);
            });
        });
}

const showRepository = r => {
    const repos = `
        <li class="repository-name">
            <button class="repository-link">${r.name}</button>
        </li>
    `;
    repositoryList.insertAdjacentHTML('beforeend',repos);
}


const showCommit = c => {
    const imageSrc = c.author && c.author.avatar_url ? c.author.avatar_url : '/img/github-image.png';

    const commt = `
    <li class="commit-element">
        <div class="commit-avatar"><img src="${imageSrc}" /></div>
        <div class="commit-message">${c.commit.message}</div>
        <div class="commit-date">${c.commit.author.date}</div>
        <div class="commit-autor">${c.commit.author.name}</div>
    </li>
    `;
    commit.insertAdjacentHTML('beforeend',commt);
}

getRepository();