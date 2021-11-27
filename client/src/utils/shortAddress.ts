export default function (address: string): string {
    return address.substr(0, 5) + '...' + address.substr(-5)
}