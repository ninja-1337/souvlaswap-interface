import { request } from 'graphql-request'
import useSWR from 'swr'

const QUERY = `{
    bar(id: "0x1132b1e57C99d03A947F1f3fc8e37De80144E6CC") {
      ratio
    }
}`

// @ts-ignore TYPE NEEDS FIXING
const fetcher = (query) => request('https://api.thegraph.com/subgraphs/name/matthewlilley/bar', query)

// Returns ratio of XSushi:Sushi
export default function useSushiPerXSushi(parse = true) {
  const { data } = useSWR(QUERY, fetcher)
  return parse ? parseFloat(data?.bar?.ratio) : data?.bar?.ratio
}
