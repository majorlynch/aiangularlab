export function formatResponse(input: string): string {
    return input
      .replace(/\#\#\#\#\#\#(.*?)\n/g, '<h6>$1</h6>')
      .replace(/\#\#\#\#\#(.*?)\n/g, '<h5>$1</h5>')
      .replace(/\#\#\#\#(.*?)\n/g, '<h4>$1</h4>')
      .replace(/\#\#\#(.*?)\n/g, '<h3>$1</h3>')
      .replace(/\#\#(.*?)\n/g, '<h2>$1</h2>')
      .replace(/\#(.*?)\n/g, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/\*\*\*(.*?)\*\*\*/g, '<b><i>$1</i></b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace('```', '');
}
