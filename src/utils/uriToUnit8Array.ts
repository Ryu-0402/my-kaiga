import * as FileSystem from "expo-file-system/legacy";

export async function uriToUint8Array(uri: string): Promise<Uint8Array> {
  const b64 = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });

  const binary = globalThis.atob(b64);

  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}