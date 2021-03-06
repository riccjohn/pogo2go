import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Login, Signup, UserHome} from './components'
import {me} from './store'
import AllProducts from './components/AllProducts'
import LandingPage from './components/LandingPage'
import SingleProduct from './components/SingleProduct'
import Error404 from './components/Error404'
import StripeCheckout from './components/StripeCheckout.js'
import ShoppingCart from './components/ShoppingCart'
import {fetchUserData} from './store/userReducer'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {user, isLoggedIn} = this.props
    // This call is to load the cart data at the top of the component hiearachy
    // to handle the case where someone hard refreshes on the ShoppingCart or
    // Checkout Page components
    isLoggedIn && !user.orders && this.props.fetchUserData(user.id)

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/store/:id" component={SingleProduct} />
        <Route exact path="/store" component={AllProducts} />
        <Route exact path="/checkout" component={StripeCheckout} />
        <Route exact path="/cart" component={ShoppingCart} />
        <Route exact path="/" component={LandingPage} />
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route path="/home" component={UserHome} />
          </Switch>
        )}
        {/* Displays our Login component as a fallback */}
        <Route component={Error404} />
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    user: state.user, // not part of boiler plate, but see line 26 for clarifying comment
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {

  return {
    // fetchUserData not part of boiler plate, but see line 26 for clarifying comment
    fetchUserData: userId => dispatch(fetchUserData(userId)),
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
