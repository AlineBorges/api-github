const repositoryList = document.querySelector('.repository-list'),
      commit = document.querySelector('.box-commit'),
      body = document.querySelector('body'),
      loadMore = document.querySelector('.loadMore');

let fork = document.querySelector('.box-number-forks'),
    star = document.querySelector('.box-number-stars');
    contribs = document.querySelector('.box-number-contribs'),
    start = 0,
    end = 20,
    currentRepository = '';


body.addEventListener('click', (e) => {
    if (e.target.className === 'repository-link') {
        const activeItem = document.querySelector('.active');
        activeItem ? activeItem.classList.remove('active') : null;
        e.target.parentNode.classList.add('active');
        getRepositoryInfo(e.target.innerText);
    }

    if (e.target.className === 'loadMore') {
        start = start + end;
        end += 20;
        getCommitList(currentRepository);
    }
});

const getRepository = () => {
    let URL = "https://api.github.com/users/deezer/repos";
    fetch(URL)
        .then(response => response.json())
        .then(response => {
            response.sort((repo1, repo2) => {
                return repo1.stargazers_count < repo2.stargazers_count ? 1 : -1;
            });
            response.forEach( r => {
                showRepository(r);
            });
        });
}

const getRepositoryInfo = (repository) => {
    commit.innerHTML = '';
    let URL = `https://api.github.com/repos/deezer/${repository}`;
    currentRepository = repository
    fetch(URL)
        .then(response => response.json())
        .then(response => {
            start = 0;
            end = 20;
            loadMore.removeAttribute('disabled');
            getCommitList(repository);
            fork.innerHTML = response.forks_count;
            star.innerHTML = response.stargazers_count;
        });
}

const getCommitList = (repository) => {
    let URL = `https://api.github.com/repos/deezer/${repository}/commits`;
    fetch(URL)
        .then(response => response.json())
        .then(response => {
            contribs.innerHTML = response.length;
            if (end > response.length) {
                loadMore.setAttribute('disabled', 'disabled');
            }
            for (let i = start; i < end; i++) {
                if (response[i])
                    showCommit(response[i]);
            }
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
    let newDate = new Date(c.commit.author.date);
    const commt = `
    <li class="commit-element">
        <div class="commit-avatar"><img src="${imageSrc}" /></div>
        <div class="commit-message">${c.commit.message}</div>
        <div class="commit-date">${newDate.toLocaleDateString('pt-BR')}</div>
        <div class="commit-autor">${c.commit.author.name}</div>
    </li>
    `;
    commit.insertAdjacentHTML('beforeend',commt);
}

getRepository();