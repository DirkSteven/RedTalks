import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

function CreatePost(){
    return(
        <>
        <Link to="/" className="modalClose"><FaArrowLeft/></Link>
        <div className="postcreation">
            <h1>Create Post</h1>
            <form>
            <input type="text" className="inputPostTitle" placeholder="Title"></input>
            <textarea placeholder="Body"></textarea>
            <div className="publish">
                <button>Post</button>
            </div>
            </form>
        </div>
        </>
    );
}

export default CreatePost;