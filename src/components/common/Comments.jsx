import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuthContext } from '../../context/AuthContext';
import { Star, Send } from 'lucide-react';
import { doc, deleteDoc } from "firebase/firestore";


const Comments = ({ movieId, movieName }) => {
    const { user } = useAuthContext();
    const [text, setText] = useState("");
    const [rating, setRating] = useState(5);
    const [list, setList] = useState([]);

    // Lấy bình luận Real-time
    useEffect(() => {
        if (!movieId) return;
        const q = query(
            collection(db, "comments"),
            where("movieId", "==", movieId),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [movieId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!user) return alert("Bạn cần đăng nhập!");
        if (!text.trim()) return;

        try {
            await addDoc(collection(db, "comments"), {
                movieId,
                movieName,
                uid: user.uid,
                displayName: user.displayName || "Ẩn danh",
                photoURL: user.photoURL || "",
                content: text,
                rating,
                createdAt: serverTimestamp(),
            });
            setText("");
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có muốn xóa bình luận này?")) {
            await deleteDoc(doc(db, "comments", id));
        }
    };

    const handleKeyDown = (e) => {
    // Nếu nhấn Enter và KHÔNG giữ phím Shift (để tránh nhầm với xuống dòng)
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Ngăn việc xuống dòng mặc định
        handleSend(e); // Gọi hàm gửi bình luận
    }
};

    return (
        <div className="mt-12 bg-slate-900/50 rounded-3xl p-6 md:p-8 border border-white/5">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                Bình luận <span className="text-sm bg-slate-800 text-white px-2 py-0.5 rounded-full">{list.length}</span>
            </h3>

            {/* FORM NHẬP */}
            <form onSubmit={handleSend} className="mb-10">
    {/* Phần chọn Sao giữ nguyên */}
    <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map(num => (
            <Star
                key={num}
                className={`w-5 h-5 cursor-pointer transition ${rating >= num ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                onClick={() => setRating(num)}
            />
        ))}
    </div>

    <div className="relative">
        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown} // Thêm sự kiện này
            placeholder="Bạn thấy phim này thế nào? (Ấn Enter để gửi)..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-16 text-white outline-none focus:border-blue-500 transition min-h-[100px]"
        />
        <button type="submit" className="absolute bottom-4 right-4 p-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition">
            <Send className="w-5 h-5 text-white" />
        </button>
    </div>
</form>


            {/* DANH SÁCH BÌNH LUẬN */}
            <div className="space-y-6">
                {list.length > 0 ? (
                    list.map(item => (
                        <div key={item.id} className="flex gap-4 group">
                            {/* Avatar vòng tròn chứa chữ cái đầu của tên */}
                            <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white uppercase shadow-lg">
                                {item.displayName?.charAt(0) || "U"}
                            </div>

                            <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:bg-white/10 transition relative">
                                {/* Header: Tên và Ngày giờ */}
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-blue-400 leading-none">{item.displayName}</h4>
                                        {/* Hiển thị Ngày giờ bình luận */}
                                        <span className="text-[10px] text-gray-500 mt-1 block">
                                            {item.createdAt?.toDate()
                                                ? item.createdAt.toDate().toLocaleString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })
                                                : "Đang gửi..."}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        {/* Số sao đánh giá */}
                                        <div className="flex gap-0.5">
                                            {[...Array(item.rating || 5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                            ))}
                                        </div>

                                        {/* Nút xóa - Chỉ hiện nếu là chủ sở hữu */}
                                        {user && user.uid === item.uid && (
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-[11px] text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition duration-300"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Nội dung bình luận */}
                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {item.content}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500 italic">
                        Chưa có bình luận nào cho phim này.
                    </div>
                )}
            </div>
        </div>
    );
};


export default Comments;