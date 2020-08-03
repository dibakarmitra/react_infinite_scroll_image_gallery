import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import './App.css';

class App extends React.Component {
  state = {
    photos: [],
    query: 'nature',
    pageNumber: 1,
    perPage: 10,
    hasMore: true,
    totalPages: null,
    totalResults: null
  };

  componentDidMount() {
      //initial request is sent
    this.fetchData();
  }

  fetchData = async () => {
    const URL = 'https://api.pexels.com/v1/search'
    const API_KEY = '563492ad6f91700001000001a2b79e67fccd45828be2b65c6737ff23'

    await axios.get(URL, {
            params: { query: this.state.query, page: this.state.pageNumber, per_page: this.state.perPage },
            headers: { Authorization: API_KEY }
            }
      )
      .then(res =>{
        if (res) {
                this.setState({
          //updating data
          photos: [...this.state.photos, ...res.data.photos],
          //updating page numbers
          pageNumber: (this.state.pageNumber + 1),
          //updating total pages
          totalPages: Math.round(res.data.total_results / res.data.per_page),
          //updating total results
          totalResults: res.data.total_results,
        })
        if (this.state.pageNumber >= this.state.totalPages) {
            this.setState({
                //updating has more 
                hasMore: false
            })
        }
    } else {
        console.log('error');
    }
      });
  };

  render() {
    return (
      <div className="main-container">    
      <h1>App Infinity Image Gallery</h1>
      <div className="infinite-scroll-component">  
        <InfiniteScroll
          dataLength={this.state.photos.length} //This is important field to render the next data
          next={this.fetchData}
          hasMore={this.state.hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{textAlign: 'center'}}><b>No more results</b></p>
          }
          refreshFunction={this.fetchData}
        >
        <ul className="image-grid">
          {this.state.photos.map(photo => (
              <li className="image-item" key={Math.random(photo.id)}><img className="lazy" src={photo.src.large} alt={photo.id} /></li>
          ))}
          </ul>
        </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default App;