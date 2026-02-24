export default function fromYouTubeURI(uri: string): string {
  const match = uri.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  return match && match.length > 0 ? match[1] : "";
}