import React, { Component } from "react"
import Head from 'next/head'
import Image from 'next/image'
import Logo from "../components/Logo"
import { chunk, flatten } from "lodash"
import axios from "axios"

export default class Home extends Component{
  state = {
    chunkLogos:[],
      logos: [],
      page: 0,
      filter:''
  }
  constructor(props) {
    super(props)
    this.filterLogo = this.filterLogo.bind(this);
    this.moreLogos = this.moreLogos.bind(this);
  }

  componentDidMount() {
    const chunkLogos = chunk(this.props.logos,30);
    this.setState({...this.state,chunkLogos,logos:chunkLogos[0]})
  }

  filterLogo(event) {
    this.setState({ ...this.state, filter: event.target.value });

    if (event.target.value) {
      const logos = this.props.logos.filter(item => item.name.includes(event.target.value))
      this.setState({ logos: logos,chunkLogos:chunk(logos,30) })
    } else {
      this.setState({logos: this.props.logos,page: 0})
    }
  }

  moreLogos() {
    const { page,chunkLogos } = this.state;
    if (page >= chunkLogos.length) return false;
    this.setState({
      ...this.state,
      page: page + 1,
      logos: flatten(chunkLogos.slice(0, page + 1))
    })
  }

  render() {
    return (
      <div className="main">
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="slogan flex items-center justify-center flex-col leading-loose">
          <h1 className="text-5xl">Instant Logo Search</h1>
          <p className="my-4 text-lg text-gray-500">Search & download thousands of logos instantly</p>

          <div className="relative rounded-md shadow-sm w-8/12 mx-auto">
            <div className="absolute flex items-center pointer-events-none top-1/2 left-2 -mt-2">
              <Image src="/search.svg" alt="Search" width={16} height={16} className="text-gray-200"/>
            </div>
            <input type="text" className="block w-full h-10 p-6 pl-10 border-gray-300 rounded-md shadow-lg" placeholder="1Password" onChange={this.filterLogo}/>
          </div>
        </main>

        <div className="logos p-10">
          <Logo data={this.state.logos} />
          {
            this.state.logos.length<30?"":this.state.page >= this.state.chunkLogos.length ? <div className="logos-more">No More</div> :<div className="logos-more" onClick={this.moreLogos}>More Logos</div>
          }

        </div>


        <footer>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </footer>
      </div>
    )
  }

}

export async function getStaticProps() {
  const {data} = await axios.get("https://apis.manon.icu/logos");
  return {
    props: {
      logos:data.code === 0 ? data.data:[]
    }
  }
}
