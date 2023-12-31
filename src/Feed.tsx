import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import abi from '../src/utils/counterAbi.json'
import './Feed.css'
import { typeExam } from "./type";

interface Student {
  id: number;
  examName: string;
  studentName: string;
  studentEmail: string;
  studentMarks: string;
  username: string;
}

interface Props {
  provider: any
}

const Feed: React.FC<Props> = ({ provider }) => {
  const [posts, setPosts] = useState<Student[]>([]);
  const [item, setItem] = useState({ name: "all" });
  const [active, setActive] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const getUpdatedStudents = (allStudents: Student[], _address: string) => {
    let updatedStudent: Student[] = [];
    for (let i = 0; i < allStudents.length; i++) {
      let student: Student = {
        id: allStudents[i].id,
        examName: allStudents[i].examName,
        studentName: allStudents[i].studentName,
        studentEmail: allStudents[i].studentEmail,
        studentMarks: allStudents[i].studentMarks,
        username: allStudents[i].username,
      };
      updatedStudent.push(student);
    }
    return updatedStudent;
  }

  const getAllStudents = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const accountAddress = "0xfad32934ce67118dfc58d93141316b4fa98c7044"
        const StudentContract = new ethers.Contract(
          accountAddress,
          abi,
          provider
        )

        let allStudents: Student[] = await StudentContract.getAllStudents();
        setPosts(getUpdatedStudents(allStudents, ethereum.selectedAddress));
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getCustomStudents = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const accountAddress = "0xfad32934ce67118dfc58d93141316b4fa98c7044"
        const StudentContract = new ethers.Contract(
          accountAddress,
          abi,
          provider
        )

        let allStudents: Student[] = await StudentContract.getAllStudents();
        const newStudents: Student[] = allStudents.filter((post) => {
          return item.name === post.examName;
        });
        setPosts(getUpdatedStudents(newStudents, ethereum.selectedAddress));
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (item.name === "all") {
      getAllStudents();
    } else {
      getCustomStudents();
    }
  }, [item]);

  const handleSearch = () => {
    const filteredStudents = posts.filter((post) =>
      post.studentEmail.includes(searchTerm)
    );
    setPosts(filteredStudents);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search by Student ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}
          style={{ backgroundColor: "#5b56af",  margin: "20px"}}>Search</button>
      </div>
      <div>
        {typeExam.map((item, index) => (
          <span
            onClick={(e) => {
              setItem({ name: e.currentTarget.textContent || '' });
              setActive(index);
            }}
            className={`${active === index ? 'active-work' : ''} work__item`}
            key={index}
          >
            {item.name}
          </span>
        ))}
      </div>

      <ul className="cards">
        {posts
          .sort((a, b) => parseInt(String(b.id)) - parseInt(String(a.id)))
          .map((post) => (
            <li className="cards_item" key={post.id}>
              <div className="card">
                <div className="card_content">
                  <p className="card_title">{parseInt(String(post.id))}</p>
                  <p className="card_title">{post.examName}</p>
{/*                   <p className="card_text">
                    <b>Name:<br /> </b>{post.studentName}
                  </p> */}
                  <p className="card_text">
                    <b>StudentID:<br /> </b>{post.studentEmail.slice(0, post.studentEmail.indexOf('@'))}
                  </p>
                  <p className="card_text">
                    <b>Marks:<br /> </b>{post.studentMarks}
                  </p>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Feed;
