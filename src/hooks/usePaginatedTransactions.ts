import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [isLoading, setIsLoading]=useState(false);
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    if (paginatedTransactions && paginatedTransactions.nextPage === null) {
      setIsLoading(false);
      console.log("Transactions -> ", paginatedTransactions);
      return;
    }
    console.log("Inside PaginatedT")
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
      }
    )

    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      }
      if (response && previousResponse){
        console.log(previousResponse.data, "data trans")
        console.log(response.data, "data 2")

        return {
          ...response,
          data: [...previousResponse.data, ...response.data]
        }
      }
      // console.log(response.nextPage);
      return { data: response.data, nextPage: response.nextPage }
      
    })
     setIsLoading(false);
  }, [fetchWithCache, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  return { data: paginatedTransactions, loading, fetchAll, invalidateData }
}
