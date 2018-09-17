import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchUserData} from '../store/userReducer'
import {Link} from 'react-router-dom'

class ShoppingCart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      productList: []
    }
  }

  async componentDidMount() {
    let {user, isLoggedIn} = this.props
    const productListOnLocalStorage = JSON.parse(
      window.localStorage.getItem('productList')
    )
    this.setState({
      productList: productListOnLocalStorage ? productListOnLocalStorage : []
    })

    if (isLoggedIn) {
      const userId = user.id
      // OB: shouldn't be necessary, user data should already be on `this.props.user`
      await this.props.fetchUserData(userId)
      const aUser = this.props.user
      if (!this.state.productList) {
        // go see if there's a shopping cart on the user, and if so populate local state
        this.setState(
          aUser.orders.length
            ? aUser.orders.find(order => !order.isPurchased).products
            : []
        )
      }
    }
  }

  render() {
    let {user, isLoggedIn} = this.props
    let productList = this.state.productList

    // assuming that if you're logged in we're pulling from state (I think there are corner cases that will be screwed) then

    // OB: anything not stricly related to view logic could be moved into some utility function
    const orderTotal = productList.length
      ? productList
          .map(product => Number(product.price))
          .reduce((curr, acc) => curr + acc, 0)
      : 0

    const removeItem = removedItemId => {
      //update product list in localStorage
      let cartList = JSON.parse(window.localStorage.getItem('productList'))
      cartList.splice(cartList.findIndex(item => item.id === removedItemId), 1)
      console.log('cartList', cartList)
      this.setState({productList: cartList})
      window.localStorage.setItem('productList', JSON.stringify(cartList))
    }

    // if you're logged in but you don't have a user, you have to show loading till we get the user from the update of redux state in componentDidMount
    // or
    // if you're not loggged in and there's no productList on local storage we have to render a blank cart
    //    if (isLoggedIn && aUser)  {
    if (false) {
      //currently forcing the else condition while testing use of localStorage
      return <div>Loading!</div>
    } else {
      return (
        <React.Fragment>
          <div>
            <table>
              <tbody>
                <tr>
                  <th>product name</th>
                  <th>price</th>
                </tr>
                {productList.map(prod => {
                  return (
                    <tr key={prod.id}>
                      <td>{prod.name}</td>
                      <td>{prod.price}</td>
                      <td>
                        <button
                          type="submit"
                          onClick={() => removeItem(prod.id)}
                        >
                          remove item
                        </button>
                      </td>
                    </tr>
                  )
                })}
                <tr>
                  <td>
                    <b>total</b>
                  </td>
                  <td>{orderTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <Link to="/store">Continue Shopping</Link>
            <br />
            <Link to="/checkout">Checkout</Link>
          </div>
        </React.Fragment>
      )
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  isLoggedIn: !!state.user.id
})

const mapDispatchToProps = dispatch => ({
  fetchUserData: userId => dispatch(fetchUserData(userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart)