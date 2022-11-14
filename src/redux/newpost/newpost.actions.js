import { API } from "../../shared/services/api"


export const createPost = (formData) =>async(dispatch)=>{
    dispatch({type:'creatingPost'})
    try {
        console.log(formData);
        const post = await API.post('posts/create', formData);
        console.log(post);
        dispatch({type: 'postCreated'})
    } catch (error) {
        console.log(error);
        dispatch({type: 'error', payload:error})
    }
}
