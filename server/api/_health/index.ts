export default defineEventHandler((event) => {
  return {
    message: 'Hello World from h3 server...!',
    health: 'Ok'
  }
})