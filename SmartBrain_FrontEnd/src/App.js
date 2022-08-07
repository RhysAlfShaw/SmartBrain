import './App.css';
import Navigation from './component/Navigation/Navigation';
import Logo from './component/Logo/Logo';
import Rank from './component/Rank/Rank';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './component/FaceRecognition/FaceRecognition'
import SignIn from './component/SignIn/SignIn';
import React, { Component} from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import particlesOptions from "./particles.json";
import Clarifai from 'clarifai';
import Register from './component/Register/Register';



const initalstate= {
    input:'',
    imageUrl:'',
    box: {},
    route:'signin',
    isSignedIn:false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: '',
    
  }
}

class App extends Component {
  

  particlesInit = (main) => {
    loadFull(main);
  }

  constructor() {
    super();
    this.state = initalstate;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
  

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row*height)
    }
  }
  
  displayFacebox = (box) => {
    console.log(box);
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }
  
  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    fetch('http://localhost:3000/imageurl',{
        method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
             input: this.state.input,
          })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('http://localhost:3000/image',{
          method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id,
            })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
        .catch(console.log)
      }
    this.displayFacebox(this.calculateFaceLocation(response))})
    .catch(err => console.log(err));
      
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initalstate)
      
    }
    else if (route ==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route: route})
  }

  render() {
    
    return (
    <div className="App">
      <Particles className='Particles' options={particlesOptions} init={this.particlesInit}/>
      
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
      { this.state.route === 'home' 
        ? <div> 
            <Logo/>
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onSubmit}/>
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
          </div>
        : this.state.route ==='signin' 
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
          : ( 
            this.state.route === 'signout'
              ?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> )
      }
    </div>
  );}
}

export default App;
