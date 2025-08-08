import { useEffect, useState } from "react"
import axios from "axios";

export interface Course {
    id: string,
    slug: string,
    title: string
}

export const useCourses = () => {
    const [loading, setLoding] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/courses`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                setCourses(res.data.courses);
                setLoding(false)
            })
    }, [])

    return {loading, courses}
}


export const useCourse = () => {
    const {loading, courses} = useCourses();
    const [selectedCourse, setSelectedCourse] = useState<Course>();


    useEffect(() => {
        setSelectedCourse(courses[0])
    }, [courses])


    return {
        loading, selectedCourse, setSelectedCourse
    }

}