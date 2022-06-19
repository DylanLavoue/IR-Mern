import React from 'react'
import {Box} from '@chakra-ui/layout'
import {CloseIcon} from '@chakra-ui/icons'

const UserBadgeItem = ({user, handleFunction}) => { // first proposition will be user and handleFunction
    return (
        <Box
         px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorscheme="blue"
      cursor="pointer"
      onClick={handleFunction}
      >{user.name}
      
      <CloseIcon pl={1} />
      </Box> //renders the name
    
    )
}

export default UserBadgeItem
