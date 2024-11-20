function CreatePost(){
    return(
        <>
        <div className="postcreation">
            <h1>Create Post</h1>
            <form>
            <h3>Title</h3>
            <input type="text" className="inputPostTitle"></input>
            <h3>Body</h3>
            <textarea></textarea>
            <div className="publish">
                <button>Post</button>
                <button>Cancel</button>
            </div>
            </form>
        </div>
        </>
    );
}

export default CreatePost;