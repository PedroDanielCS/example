export function IsNullOrEmpty(str: string): boolean {
  if (str == null || str.length === 0) return false;

  return true;
}

export function TrimStart(str: string, c: string): string {
  if (str.length == 0) return str;

  c = c ? c : " ";
  var i = 0;
  for (; i < str.length && str.charAt(i) == c; i++);
  return str.substring(i);
}
