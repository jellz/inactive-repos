const USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
const INACTIVE_MARK = 1.814e+9; // 3 weeks in ms - after a project is inactive for 3 weeks or longer, it is considered abandoned

$('#main-form').on('submit', async (e) => {
  e.preventDefault();
  let username = $('#gh-username-input').val().trim();
  if (!USERNAME_REGEX.test(username)) return alert('Invalid username');
  let res = await fetch(`https://api.github.com/users/${username}/repos`);
  if (res.status === 404) return alert('Invalid user');
  let json = await res.json();
  let repos = json.sort((a, b) => new Date(a.pushed_at).getTime() - new Date(b.pushed_at).getTime());
  $('.list').empty();
  initRepoList(repos);
});

var initRepoList = (repos) => {
  repos.forEach((r) => {
    r.pushed_at_humanized = timeAgo(new Date(r.pushed_at));
  });
  let options = {
    valueNames: [ 'name', 'pushed_at_humanized' ],
    item: '<li><h3 class="name"></h3> <p class="pushed_at_humanized"></p></li>'
  };
  console.log(repos);
  let repoList = new List('repo-list-wrapper', options, repos);
}