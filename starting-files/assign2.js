
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

document.addEventListener("DOMContentLoaded", function(){
   let api_data;
   if(localStorage.getItem("data") === null){
      api_data = fetch_api(api);
   }
   else{
      api_data =JSON.parse(localStorage.getItem("data"));
   }
   
   let popularity = get_top_15(api_data);

   //fill popupular songs
   let pop_list = document.getElementById("popular");

   for(let i = 0 ; i < 15; i++){
      let list_item = document.createElement("li");
      let artist_name = api_data.find(song => {
         return song.song_id == popularity[i].song_id;
      }).artist.name;
      let song_name = api_data.find(song => {
         return song.song_id == popularity[i].song_id;
      }).title;

      list_item.textContent = `${song_name} by ${artist_name}`;
      pop_list.appendChild(list_item);
   }

   //fill top artists
   let artists = get_top_artists(api_data);
   let artist_list = document.getElementById("artists");

   for(let i = 0 ; i < 15; i++){
      let list_item = document.createElement("li");
      let artist_name = artists[i].artist;
      list_item.textContent = `${artist_name}`;
      artist_list.appendChild(list_item);
   }

   //fill top genres
   let genres = get_top_genres(api_data);
   let genre_list = document.getElementById("genres");

   for(let i = 0 ; i < 15; i++){
      let list_item = document.createElement("li");
      let genre_name = genres[i].genre;
      list_item.textContent = `${genre_name}`;
      genre_list.appendChild(list_item);
   }


   let parent = document.getElementsByTagName("body");

   parent[0].addEventListener("click", function(e){

      if(e.target && e.target.classList.contains("home_button")){
         let home_view = document.getElementById("home");
         let search_view = document.getElementById("search");
         let playlist_view = document.getElementById("playlist");
         let song_view = document.getElementById("song");

         search_view.style.display = "none";
         home_view.style.display = "block";
         playlist_view.style.display = "none";
         song_view.style.display = "none"
      }
   })

   parent[0].addEventListener("click", function(e){

      if(e.target && e.target.classList.contains("search_button")){
         let home_view = document.getElementById("home");
         let search_view = document.getElementById("search");
         let playlist_view = document.getElementById("playlist");
         let song_view = document.getElementById("song");

         search_view.style.display = "block";
         home_view.style.display = "none";
         playlist_view.style.display = "none";
         song_view.style.display = "none"
      }
   })



})

/*



*/
function fetch_api(api_url){
   let api_data;

   fetch(api_url)
      .then(response => response.json())
      .then( data => {
         let serialized = JSON.stringify(data);
         localStorage.setItem("data", serialized);
         api_data = JSON.parse(localStorage.getItem("data"));
         
      })
      .catch(error => {console.error(error)});
   

      return api_data;
}
/*
Input: Array with song data
Returns: Array with objects that have song_id and popularity values arranged
from most popular to least popular
*/
function get_top_15(api_data){
   const popularity = [];
   for(let i = 0; i<api_data.length; i++){
      let popular_song = {popularity_val: api_data[i].details.popularity, song_id: api_data[i].song_id};
      popularity.push(popular_song);
   }

   popularity.sort((a,b) =>{
      return a.popularity_val - b.popularity_val;
   });
   return popularity.slice(popularity.length - 15, popularity.length).reverse();;
}

function get_top_artists(api_data){

   const artists = [];

   for(let i = 0 ; i < api_data.length; i++){
      if(artists.filter(e => e.artist === api_data[i].artist.name).length == 0 || artists.length == 0){
         artists.push({artist:api_data[i].artist.name, songs: 1});
      }
      else{
         artists[artists.findIndex(e => e.artist === api_data[i].artist.name )].songs++;
      }

   }
   artists.sort((a,b) =>{
      return a.songs - b.songs;
   });
   return artists.slice(artists.length - 15, artists.length).reverse();

}

function get_top_genres(api_data){

const genres = [];

   for(let i = 0 ; i < api_data.length; i++){
      if(genres.filter(e => e.genre === api_data[i].genre.name).length == 0 || genres.length == 0){
         genres.push({genre:api_data[i].genre.name, songs:1});
      }
      else{
         genres[genres.findIndex(e => e.genre === api_data[i].genre.name )].songs++;
      }

   }
   genres.sort((a,b) =>{
      return a.songs - b.songs;
   });
   return genres.slice(genres.length - 15, genres.length).reverse();
}  
