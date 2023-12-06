import Feed from './Feed'
import './App.css'
import { providers } from 'ethers'

const provider = new providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/WKt36nnE7q-P6GBLry-wWJuc5lf0jkoc"
);

function App() {


  return (
    <>
      <Feed provider={provider}/>
    </>
  )
}

export default App
