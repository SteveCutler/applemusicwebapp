import React from 'react'
import { SlOptions } from 'react-icons/sl'

const OptionsModal = () => {
    const style = { fontSize: '1.5rem', color: 'white' }
    return (
        <div
            onClick={async e => {
                e.preventDefault()
                e.stopPropagation() // Prevents the link's default behavior
                // await FetchAlbumData(albumId)
                // handlePlayPause()
            }}
            className="transform dropdown  flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
        >
            <div
                tabIndex={0}
                role="button"
                className=" bg-slate-400 rounded-full p-1"
            >
                <SlOptions style={style} />
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content z-[10] menu p-2 shadow bg-base-100 flex w-fit rounded-box "
            >
                <li>
                    <a>Item 1</a>
                </li>
                <li>
                    <a>Item 2</a>
                </li>
            </ul>
        </div>
        // <details className="dropdown rounded-full p-1 bg-slate-400">
        //     <summary>
        //
        //     </summary>
        //     <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
        //         <li>
        //             <a>Item 1</a>
        //         </li>
        //         <li>
        //             <a>Item 2</a>
        //         </li>
        //     </ul>
        // </details>
    )
}

export default OptionsModal
