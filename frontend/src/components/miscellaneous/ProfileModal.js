import React from 'react';
import { useDisclosure } from '@chakra-ui/hooks';
import { ViewIcon } from "@chakra-ui/icons";
import { Image, Text} from "@chakra-ui/react"
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Button, IconButton } from '@chakra-ui/react'

const ProfileModal = ({user, children}) => { 

    const { isOpen, onOpen, onClose} = useDisclosure();

    return (
        <>
            {children? (
            <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    d={{ base: "flex" }}
                    icon={<ViewIcon/>}
                    onClick={onOpen}
                    />
            )}
             <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay/>
      <ModalContent h="410px">
        <ModalHeader
        fontSize="40px"
        fontFamily="Work sans"
        d="flex"
        justifyContent="center"
        >
            {user.name}
            </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image
          borderRadius="full"
          boxSize="150px"
          src={user.pic}
          alt={user.name}
          />
          <Text
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          ></Text>
        </ModalBody>

        <ModalFooter>
            <Button colorscheme="blue" mr={3} onClick={onClose}>
                Close
            </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
            </>
    );
        
};

export default ProfileModal
