import React from 'react'
import DynamicCollegeHeader from './header/header'
import DynamicCollegeFooter from './footer/footer'
import Content from './content/content'

const College = () => {
  return (
    <>
      <DynamicCollegeHeader/>
      <Content/>
      <DynamicCollegeFooter/>
    </>
  )
}

export default College