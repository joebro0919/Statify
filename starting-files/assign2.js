
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

document.addEventListener("DOMContentLoaded", function(){
   let api_data;
   if(localStorage.getItem("data") === null){
      api_data = fetch_api(api);
   }
   else{
      api_data =JSON.parse(localStorage.getItem("data"));
   }
   
   api_data.sort((a, b) => {
      const nameA = a.title.toUpperCase(); // ignore upper and lowercase
      const nameB = b.title.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
   
   let popularity = get_top_15(api_data);

   //fill popupular songs
   let pop_list = document.getElementById("popular");

   for(let i = 0 ; i < 15; i++){
      let list_item = document.createElement("li");
      list_item.className = "song_link";
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
   let top_artists = get_top_artists(api_data);
   let artist_list = document.getElementById("artists");

   for(let i = 0 ; i < 15; i++){
      let list_item = document.createElement("li");
      let artist_name = top_artists[i].artist;
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
   
   display_search_page(api_data);
   
   let sort_button = document.querySelectorAll(".song_container img");

   sort_button[0].addEventListener("click",function(){
      let title_sort = api_data.sort((a, b) => {
         const nameA = a.title.toUpperCase(); // ignore upper and lowercase
         const nameB = b.title.toUpperCase(); // ignore upper and lowercase
         if (nameA < nameB) {
           return -1;
         }
         if (nameA > nameB) {
           return 1;
         }
         // names must be equal
         return 0;
       });
       transform_button(sort_button,0);
      display_search_page(title_sort);
   });

   

   sort_button[1].addEventListener("click",function(){
      let artist_sort = api_data.sort((a, b) => {
         const nameA = a.artist.name.toUpperCase(); // ignore upper and lowercase
         const nameB = b.artist.name.toUpperCase(); // ignore upper and lowercase
         if (nameA < nameB) {
           return -1;
         }
         if (nameA > nameB) {
           return 1;
         }
         // names must be equal
         return 0;
       });
       transform_button(sort_button,1);
       
      display_search_page(artist_sort);
   });

   sort_button[2].addEventListener("click",function(){
      let year_sort = api_data.sort((a, b) => {
         return a.year - b.year;
       });
       transform_button(sort_button,2);
      display_search_page(year_sort);
   });

   sort_button[3].addEventListener("click",function(){
      let genre_sort = api_data.sort((a, b) => {
         const nameA = a.genre.name.toUpperCase(); // ignore upper and lowercase
         const nameB = b.genre.name.toUpperCase(); // ignore upper and lowercase
         if (nameA < nameB) {
           return -1;
         }
         if (nameA > nameB) {
           return 1;
         }
         // names must be equal
         return 0;
       });
       transform_button(sort_button,3);
      display_search_page(genre_sort);
   });


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

      if(e.target && e.target.classList.contains("song_link")){
         let home_view = document.getElementById("home");
         let search_view = document.getElementById("search");
         let playlist_view = document.getElementById("playlist");
         let song_view = document.getElementById("song");

         search_view.style.display = "none";
         home_view.style.display = "none";
         playlist_view.style.display = "none";
         song_view.style.display = "block"
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

/*
function get_api_obj(api_data,obj_name){
   let result = [];
   for(let i = 0; i < api_data.length; i++){
      result.push(api_data[i].`${obj_name}`);
      
   };
   return result;
}
*/
function display_search_page(api_data){
   let search_results= document.querySelectorAll(".song_container span ul");

   for(let i = 0; i<search_results.length;i++){
      search_results[i].innerHTML = "";
   }
   
   for(let i = 0; i<api_data.length; i++){
      let song_title = document.createElement("li");
      song_title.className = "song_link";
      let artist_name = document.createElement("li");
      let year_made = document.createElement("li");
      let genre = document.createElement("li");

      artist_name.textContent = `${api_data[i].artist.name}`;
      year_made.textContent = `${api_data[i].year}`;
      genre.textContent = `${api_data[i].genre.name}`;
      
      if(api_data[i].title.length > 25){
         song_title.textContent = `${api_data[i].title.slice(0,24)}`;
         song_title.appendChild(create_ellipse(api_data[i]));
      }
      else{
         song_title.textContent = `${api_data[i].title}` ;
      }
      search_results[0].appendChild(song_title);
      search_results[1].appendChild(artist_name);
      search_results[2].appendChild(year_made);
      search_results[3].appendChild(genre); 
   }
}

function create_ellipse(api_data_obj){
   let ellipse = document.createElement("button");
   ellipse.className = "ellipse";
   ellipse.innerHTML = "...";
   ellipse.addEventListener("click",function(){
      let popup = document.createElement("p");
      popup.textContent = `${api_data_obj.title}`;
      popup.className = "popup";
      ellipse.appendChild(popup);
      setTimeout(function(){
         popup.style.display="none";
      },5000)
   })
   return ellipse;
}

function transform_button(button,num){
   for(let i = 0; i < 4; i++){
      if(i == num){
         button[i].style.transform = "rotate(180deg)";
      }
      else{
         button[i].style.transform = "none";
      }
   }
}