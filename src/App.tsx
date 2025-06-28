import { ChakraProvider, Container, Tab, TabList, TabPanel, TabPanels, Tabs, extendTheme } from '@chakra-ui/react'
import { useState } from 'react'
import ConfigTab from './components/ConfigTab'
import VotingTab from './components/VotingTab'
import { Participant } from './types'

// Create a dark theme
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white'
      }
    }
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'blue'
      }
    },
    Table: {
      defaultProps: {
        variant: 'simple',
        colorScheme: 'whiteAlpha'
      }
    },
    Tabs: {
      defaultProps: {
        colorScheme: 'blue'
      }
    }
  }
})

function App() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [votingOrder, setVotingOrder] = useState<Participant[]>([])

  const handleParticipantsUpdate = (newParticipants: Participant[]) => {
    setParticipants(newParticipants)
    // Randomize voting order
    const shuffled = [...newParticipants].sort(() => Math.random() - 0.5)
    setVotingOrder(shuffled)
  }

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.xl" py={8}>
        <Tabs isFitted variant="enclosed" bg="gray.800" borderRadius="lg" p={4} boxShadow="xl">
          <TabList mb="1em">
            <Tab _selected={{ bg: 'blue.500', color: 'white' }}>Config</Tab>
            <Tab _selected={{ bg: 'blue.500', color: 'white' }}>Voting</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ConfigTab 
                participants={participants}
                onParticipantsUpdate={handleParticipantsUpdate}
              />
            </TabPanel>
            <TabPanel>
              <VotingTab 
                participants={participants}
                votingOrder={votingOrder}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </ChakraProvider>
  )
}

export default App 