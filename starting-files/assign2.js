
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
   
   let api_search = [...api_data];
   let playlist_data = [];
   let popularity = get_top_15(api_data);

   //fill popupular songs
   let pop_list = document.getElementById("popular");

   for(let i = 0 ; i < 15; i++){
      let list_item = document.createElement("li");
      list_item.className = "song_link";
      list_item.dataset.id = popularity[i].song_id;
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
   let top_artists = artists.slice(artists.length - 15, artists.length).reverse();
   let artist_list = document.getElementById("artists");

   console.log(artists);

   for(let i = 0 ; i < 15; i++){
      let list_item = document.createElement("li");
      list_item.dataset.artist = `${top_artists[i].artist}`;
      list_item.dataset.id = "artist";
      list_item.className = "search_link";
      let artist_name = top_artists[i].artist;
      list_item.textContent = `${artist_name}`;
      artist_list.appendChild(list_item);
   }

   //fill top genres
   let genres = get_top_genres(api_data);
   let top_genres = genres.slice(genres.length - 15, genres.length).reverse();
   let genre_list = document.getElementById("genres");

   for(let i = 0 ; i < 15; i++){
      let list_item = document.createElement("li");
      let genre_name = top_genres[i].genre;
      list_item.dataset.genre = `${genre_name}`;
      list_item.dataset.id = "genre";
      list_item.className = "search_link";
      list_item.textContent = `${genre_name}`;
      genre_list.appendChild(list_item);
   }
   
   

   //Populates the form on the search view
   let artist_search = document.getElementById("artist_search");
   let genre_search = document.getElementById("genre_search");

   for(let i = 0; i< artists.length; i++){
      let form_option = document.createElement("option");
      form_option.textContent=`${artists[i].artist}`;
      artist_search.appendChild(form_option);
   }

   for(let i = 0; i< genres.length; i++){
      let form_option = document.createElement("option");
      form_option.textContent=`${genres[i].genre}`;
      genre_search.appendChild(form_option);
   }


   //Sorts the modified api data by title and displays it
   let sort_button = document.querySelectorAll(".song_container img");
   sort_button[0].addEventListener("click",function(){
      let title_sort = api_search.sort((a, b) => {
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


   //Sorts the modified api data by artist and displays it
   sort_button[1].addEventListener("click",function(){
      let artist_sort = api_search.sort((a, b) => {
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

   //Sorts the modified api data by year and displays it
   sort_button[2].addEventListener("click",function(){
      let year_sort = api_search.sort((a, b) => {
         return a.year - b.year;
       });
       transform_button(sort_button,2);
      display_search_page(year_sort);
   });

   //Sorts the modified api data by genre and displays it
   sort_button[3].addEventListener("click",function(){
      let genre_sort = api_search.sort((a, b) => {
         const nameA = a.genre.name.toUpperCase(); 
         const nameB = b.genre.name.toUpperCase(); // ignore upper and lowercase
         if (nameA < nameB) {
           return -1;
         }
         if (nameA > nameB) {
           return 1;
         }
         return 0;
       });
       transform_button(sort_button,3);
      display_search_page(genre_sort);
   });


   //Event listeners for the header
   let parent = document.getElementsByTagName("body");
   let home_view = document.getElementById("home");
   let search_view = document.getElementById("search");
   let playlist_view = document.getElementById("playlist");
   let song_view = document.getElementById("song");

   parent[0].addEventListener("click", function(e){

      if(e.target && e.target.classList.contains("home_button")){
         search_view.style.display = "none";
         home_view.style.display = "block";
         playlist_view.style.display = "none";
         song_view.style.display = "none"
      }
   })

   let radar_chart = null;

   parent[0].addEventListener("click", function(e){

      if(e.target && e.target.classList.contains("song_link")){
         search_view.style.display = "none";
         home_view.style.display = "none";
         playlist_view.style.display = "none";
         song_view.style.display = "block"

         let chart = document.getElementById("myChart");
         chart.innerHTML ="";
         let song_details = document.querySelector("#song_details");
         song_details.innerHTML = "";
         
         let song = api_data.find(({song_id}) => song_id == e.target.dataset.id);
         let song_analytics = Object.values(song.analytics);
         

         if(radar_chart != null){
            radar_chart.destroy();
         }
         radar_chart = new Chart(chart,{
            type: 'radar',
            data: {
            labels: ['Energy', 'Danceability', 'Liveness', 'Valence', 'Acousticness', 'Speechiness'],
            datasets: [{
               label: 'Value',
               backgroundColor:'rgba(255,140,0,0.5)',
               borderColor:'rgb(255,140,0)',
               data: song_analytics,
               borderWidth: 2
            }]
            },
         }); 

         let song_title = document.createElement("h2");
         let artist = document.createElement("p");
         let genre = document.createElement("p");
         let year = document.createElement("p");
         let duration = document.createElement("p");

         song_title.textContent = `${song.title}`;
         artist.textContent = `Artist: ${song.artist.name}`;
         genre.textContent =  `Genre: ${song.genre.name}`;
         year.textContent =  `Year: ${song.year}`;
         let minutes = Math.floor(song.details.duration/60);
         let seconds = song.details.duration - minutes * 60;
         duration.textContent =  `Duration: ${minutes} minutes and ${seconds} seconds`;

         song_details.appendChild(song_title);
         song_details.appendChild(artist);
         song_details.appendChild(genre);
         song_details.appendChild(year);
         song_details.appendChild(duration);
      }
   })

   parent[0].addEventListener("click", function(e){

      if(e.target && e.target.classList.contains("search_button")){
         search_view.style.display = "block";
         home_view.style.display = "none";
         playlist_view.style.display = "none";
         song_view.style.display = "none"
         api_search = [...api_data];
         display_search_page(api_search);
      }
      else if(e.target && e.target.classList.contains("search_link")){
         search_view.style.display = "block";
         home_view.style.display = "none";
         playlist_view.style.display = "none";
         song_view.style.display = "none"

         if(e.target.dataset.id == "artist"){
            api_search = api_data.filter(function (val){
               return val.artist.name == e.target.dataset.artist;
            })
         }
         else if(e.target.dataset.id == "genre"){
            api_search = api_data.filter(function (val){
               return val.genre.name == e.target.dataset.genre;
            })

         }

         display_search_page(api_search);
      }
   })

   parent[0].addEventListener("click", function(e){
      if(e.target && e.target.classList.contains("playlist_button")){
         search_view.style.display = "none";
         home_view.style.display = "none";
         playlist_view.style.display = "block";
         song_view.style.display = "none"

         display_playlist_page(playlist_data);

      }
   })

   let clear_playlist_button = document.getElementById("clear_playlist");
   clear_playlist_button.addEventListener("click",function(){
      playlist_data =[];
      display_playlist_page(playlist_data);
   })

   parent[0].addEventListener("click",function(e){
      if(e.target && e.target.classList.contains("rem_frplaylist_button")){
         let index = playlist_data.findIndex(({title}) => title == e.target.dataset.song);
         console.log(index);
         playlist_data.splice(index,1);
         console.log(playlist_data);
         display_playlist_page(playlist_data);
      }
   })

   let filter = document.getElementById("filter");
   let clear = document.getElementById("clear");

   filter.addEventListener("click",function(){

      let option = document.querySelector('input[name="search_option"]:checked').value;

      if(option == "title"){
         let title = document.getElementById("title_search_val").value;
         api_search = api_data.filter(function (val){
            return val.title.includes(`${title}`);
         })
         display_search_page(api_search);
      }
      else if(option == "artist"){
         let artist = document.getElementById("artist_search_val").value;
         api_search = api_data.filter(function (val){
            return val.artist.name == artist;
         })
         display_search_page(api_search);
      }
      else if(option == "genre"){
         let genre = document.getElementById("genre_search_val").value;
         api_search = api_data.filter(function (val){
            return val.genre.name == genre;
         })
         display_search_page(api_search);
      }
      

   })

   clear.addEventListener("click",function(){
      api_search = [...api_data];
      display_search_page(api_search);
   })

   parent[0].addEventListener("click", function(e){
      if(e.target && e.target.classList.contains("playlist_add_button")){
         if(!playlist_data.find(({song_id}) => song_id == e.target.dataset.song)){
            playlist_data.push(api_data.find(({song_id}) => song_id == e.target.dataset.song));
         }
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
Returns: Array with objects that have the top 15 songs with song_id and popularity values arranged
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

/*
Input: Array with song data
Returns: Array with all artists and amount of songs they have
*/
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
   return artists;
}


/*
Input: Array with song data
Returns: Array with objects that have the top 15 genres based on how many songs are in each genre
*/

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
   return genres;
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
   let search_results = document.querySelectorAll(".song_container span ul");
   
   
   for(let i = 0; i<search_results.length;i++){
      search_results[i].innerHTML = "";
   }
   
   for(let i = 0; i<api_data.length; i++){
      let song_title = document.createElement("li");
      song_title.className = "song_link";
      song_title.dataset.id = api_data[i].song_id;
      let artist_name = document.createElement("li");
      let year_made = document.createElement("li");
      let genre = document.createElement("li");
      let add_button = document.createElement("img");
      add_button.className ="playlist_add_button";
      add_button.dataset.song = api_data[i].song_id;

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
      search_results[4].appendChild(add_button);
   }
}

function display_playlist_page(playlist_data){
   let playlist_info_list = document.querySelectorAll("#playlist ul");
   playlist_info_list[0].innerHTML = "";
   playlist_info_list[1].innerHTML = "";
   playlist_info_list[2].innerHTML = "";
   playlist_info_list[3].innerHTML = "";
   playlist_info_list[4].innerHTML = "";
         
   for(let i = 0; i<playlist_data.length; i++){
      let title_item = document.createElement("li");
      title_item.className = "song_link";
      title_item.dataset.id = playlist_data[i].song_id;
      title_item.textContent = playlist_data[i].title;
      playlist_info_list[0].appendChild(title_item);

      let artist_item = document.createElement("li");
      artist_item.textContent = playlist_data[i].artist.name;
      playlist_info_list[1].appendChild(artist_item);

      let year_item = document.createElement("li");
      year_item.textContent = playlist_data[i].year;
      playlist_info_list[2].appendChild(year_item);

      let genre_item = document.createElement("li");
      genre_item.textContent = playlist_data[i].year;
      playlist_info_list[3].appendChild(genre_item);

      let remove_button = document.createElement("img");
      remove_button.className ="rem_frplaylist_button";
      remove_button.dataset.song = playlist_data[i].title;
      playlist_info_list[4].appendChild(remove_button);
   }
   return;
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