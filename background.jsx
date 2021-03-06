import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'react-ratchet'

import Firebase from 'firebase'
let FIREBASE = new Firebase('https://lifestyles.firebaseio.com/')

import Activities from 'chrome-activities'
Activities.trackActivities()

import Reasons from 'reasons'
import ReviewPanel from 'reasons/activities/reviewPage.jsx'
import LocalReviews from 'reasons/activities/localReviews'


Activities.onActivityChanged(a => {
  console.log("onActivityChanged", a)
  let d = LocalReviews.forActivity(a)

  var eyeImage
  if (d){
    if (d == 'skip') eyeImage = 'clear'
    if (d == 'bad')  eyeImage = 'red'
    else eyeImage = 'green'
  } else {
    if (a.elapsed > 20*60*1000) eyeImage = 'redside'
    else if (a.elapsed > 10*60*1000) eyeImage = 'side'
    else eyeImage = 'clear'
  }

  console.log('updating eyeball', a.elapsed, d, `images/eyes/${eyeImage}.png`)
  chrome.browserAction.setIcon({path:`images/eyes/${eyeImage}.png`})
})


window.showPopup = el => {
  ReactDOM.render( <PopupContainer activitySource={Activities} />, el )
}

function signIn(){
  if (FIREBASE.getAuth()) return
  chrome.identity.getAuthToken({interactive: true}, tok => {
    FIREBASE.authWithOAuthToken('google', tok, err => {
      if (err) console.log(err)

      // registerUser
      fetch('https://www.googleapis.com/plus/v1/people/me', {
        headers: { 'Authorization': 'Bearer ' + tok },
      }).then(r => r.json()).then(response => {
        if (!response || !response.id) return;
        console.log('Auth response', response)
        Reasons.registerUser({
          plusID: response.id,
          name: response.displayName || null,
          image: response.image && response.image.url || null,
          gender: response.gender || null,
          email: response.emails && response.emails[0] && response.emails[0].value || null
        })
      }).catch(ex => console.error(ex))
    })
  })
}

const PleaseSignIn = () => (
  <div className="content content-padded">
    <h3>Welcome to Hindsight!</h3>
    <p>
      As you browse, you'll see an eyeball icon on chrome. When Hindsight thinks you might want to review whatever you're doing to see if it's really helpful for yourself and for others, the eyeball will turn to look at the URL bar to the left of it. If Hindsight thinks you should probably take a break the eyeball will turn red and bloodshot. If Hindsight understands how you're using the web enough to know you're on track, the iris of the eyeball turns green!
    </p>
    <p>
      Please sign in to use Hindsight. Hindsight collects your reasons and aggregate web-use statistics, but doesn't connected them to your identity. We look for common patterns between users and all data is made publicly available to researchers. We only collect your email in case we need to email all users.
    </p>
    <Button onClick={signIn}>
      Sign in
    </Button>
  </div>
)

class PopupContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {auth: FIREBASE.getAuth()}
  }

  updateAuth(data){
    this.setState({auth: data})
  }

  componentWillMount(){
    FIREBASE.onAuth(this.updateAuth, this)
  }

  componentWillUnmount(){
    FIREBASE.offAuth(this.updateAuth, this)
  }

  render(){
    let { auth } = this.state
    if (!auth) return <PleaseSignIn/>
    else return <ReviewPanel
      wasReviewed={a => Activities.wasReviewed(a)}
      activitySource={() => Activities.forReview()}
      />
  }
}
