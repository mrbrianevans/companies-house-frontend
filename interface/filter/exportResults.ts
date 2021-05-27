
interface ExportResultsParams {
  cachedFilterId: string
}
/** takes a cached filter ID, queries the database or fetches a cached version from Cloud Storage, returns a readableStream of the file*/
const exportResults: (params: ExportResultsParams)=>ReadableStream = ({cachedFilterId}) => {
  return new ReadableStream<any>()
}

export default exportResults