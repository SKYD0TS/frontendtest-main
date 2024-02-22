export function F(props: { args: () => void }) {
    console.log(props)
    return (
        <h2>aw</h2>
    )
}

export default function Page() {
    function arg() {
        console.log('xa')
    }

    return (
        <div>
            <F args={arg}></F>
        </div >
    )
}


