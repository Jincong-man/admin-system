import axios from "~/axios";

export function getImageList(id, page = 1) {
    return axios.get(`/admin/image_class/${id}/image/${page}?limit=10`);
}

export function updataImage(id, name) {
    return axios.post(`/admin/image/${id}`, { name });
}
export function deleteImage(ids) {
    return axios.post(`/admin/image/delete_all`, { ids });
}

export const upLoadImageAction = "/api/admin/image/upload"
