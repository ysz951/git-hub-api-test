'use strict';


const searchURL = 'https://api.github.com/search/users';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function markWord(username, searchTerm){
  let lowCaseName = username.toLowerCase();
  for (let i = 0; i < username.length; i++){
    if (lowCaseName.slice(i, i + searchTerm.length) === searchTerm){
      return username.slice(0, i) + `<strong>${username.slice(i, i + searchTerm.length)}</strong>` + username.slice(i + searchTerm.length)
    }
  } 
}

function displayResults(responseJson, maxResults, searchTerm) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.items.length & i<maxResults ; i++){
    // for each video object in the articles
    //array, add a list item to the results 
    //list with the article title, source, author,
    //description, and image
    $('#results-list').append(
      `<li>
      <p><strong>username:</strong> ${markWord(responseJson.items[i].login, searchTerm)}</p>
      <p><strong>repos_rul:</strong> ${responseJson.items[i].repos_url}</p>
      <p><strong>html_url:</strong> ${responseJson.items[i].html_url}</p>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getUsers(searchTerm, maxResults) {
  const params = {
    q: `${searchTerm} in:login type:user`
  };
  const queryString = formatQueryParams(params)
  
  const url = searchURL + '?' + queryString;

  console.log(url);

  const options = {
    headers: new Headers()  // Headers({key: value}) string required
  };
  fetch(url, options )
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    // .then(responseJson => console.log(responseJson.items[0] ))
    .then(responseJson => displayResults(responseJson, maxResults, searchTerm))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
 
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val().toLowerCase();
    const maxResults = $('#js-max-results').val();
    getUsers(searchTerm, maxResults);
  });
}

$(watchForm);