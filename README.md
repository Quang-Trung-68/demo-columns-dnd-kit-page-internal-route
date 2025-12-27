# 🎯 Draggable Columns Dashboard

Dashboard với khả năng kéo thả cột và routing nội bộ (Stack Navigation) cho từng cột. Mỗi cột hoạt động như một mini-browser độc lập với history stack riêng.

## [🚀 Demo Preview](https://demo-columns-dnd-kit-page-internal.vercel.app/)

## ✨ Tính năng chính

- ✅ **Drag & Drop Columns**: Kéo thả cột để sắp xếp lại vị trí
- ✅ **Internal Routing**: Mỗi cột có stack navigation riêng (Back/Forward)
- ✅ **Dynamic Columns**: Thêm/xóa cột động theo nhu cầu
- ✅ **State Management**: Truyền data giữa các pages trong cột
- ✅ **Responsive**: Scroll ngang mượt mà với SimpleBar
- ✅ **Zero Config**: Không cần setup router phức tạp

---

## 📦 Cài đặt

### 1. Clone hoặc copy code

```bash
git clone <your-repo>
cd dnd-route-test
```

### 2. Install dependencies

```bash
npm install
```

**Dependencies chính:**

```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "simplebar-react": "^3.3.2",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0",
  "lucide-react": "^0.562.0"
}
```

### 3. Chạy dev server

```bash
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

---

## 🚀 Cách sử dụng

### Cấu trúc thư mục

```
src/
├── App.jsx                 # Entry point
├── DragDropGuide.jsx       # Component chính (Dashboard)
└── main.jsx
```

### Import vào project

```jsx
// App.jsx
import DragDropDashboardDemo from "./DragDropGuide";

function App() {
  return <DragDropDashboardDemo />;
}
```

---

## 🎨 Tạo Page Component mới

### Bước 1: Tạo Component

Mỗi page component nhận 2 props:

```jsx
// MyCustomPage.jsx
const MyCustomPage = ({ onNavigate, state }) => {
  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Custom Page</h1>

      {/* 1. Hiển thị data nhận được */}
      <p>Data: {state?.customData}</p>

      {/* 2. Navigate sang page khác */}
      <button
        onClick={() => onNavigate("PostDetail", { postId: 123 })}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Go to Post Detail
      </button>
    </div>
  );
};

export default MyCustomPage;
```

**Props:**

- `state`: Object chứa dữ liệu được truyền từ page trước
- `onNavigate(componentName, data)`: Function để push page mới vào stack

### Bước 2: Đăng ký Component

Mở file `DragDropGuide.jsx`:

```jsx
// Import component mới
import MyCustomPage from "./MyCustomPage";

// 1. Thêm vào COMPONENT_REGISTRY
const COMPONENT_REGISTRY = {
  Home,
  PostDetail,
  UserProfile,
  Search,
  SearchDetail,
  MyCustomPage, // ← Thêm dòng này
};

// 2. (Optional) Thêm vào menu Add Column
const COLUMN_TYPES = [
  { type: "home", label: "Home Feed", initialComponent: "Home" },
  { type: "profile", label: "My Profile", initialComponent: "UserProfile" },
  { type: "search", label: "Search", initialComponent: "Search" },
  {
    type: "custom",
    label: "Custom Page",
    initialComponent: "MyCustomPage",
  }, // ← Thêm dòng này
];
```

✅ **Done!** Component của bạn đã sẵn sàng sử dụng.

---

## 🔄 Navigation API

### Push trang mới (thêm vào history stack)

```jsx
// Trong component
onNavigate("PostDetail", { postId: 123 });
onNavigate("UserProfile", { userId: 99, userName: "John" });
```

### Back/Forward tự động

Hệ thống tự động xử lý nút **← Back** và **→ Forward** trên header mỗi cột.  
Bạn **KHÔNG CẦN** code thêm logic back/forward.

### State Management

```jsx
// Page A: Push với data
onNavigate("PageB", { userId: 99, theme: "dark" });

// Page B: Nhận data
const PageB = ({ state }) => {
  console.log(state.userId); // 99
  console.log(state.theme); // "dark"
};
```

---

## 🎛️ Tùy chỉnh

### 1. Thay đổi columns mặc định

```jsx
// Trong DragDropDashboardDemo component
const [columns, setColumns] = useState([
  {
    id: "col-1",
    type: "home",
    navigation: {
      history: [{ componentName: "Home", state: null }],
      currentIndex: 0,
    },
  },
  // Thêm cột khác...
]);
```

### 2. Thay đổi kích thước cột

```jsx
// Tìm class trong SortableColumn component
className = "w-[320px] min-w-[320px]"; // Mặc định
// Thay đổi thành:
className = "w-[400px] min-w-[400px]"; // Cột rộng hơn
```

### 3. Custom styling

Tất cả sử dụng **Tailwind CSS**. Tìm và thay đổi các class:

```jsx
// Background color
className="bg-white" → className="bg-gray-50"

// Border
className="border-slate-200" → className="border-blue-500"

// Shadow
className="shadow-sm" → className="shadow-xl"
```

---

## 🔧 Lưu trữ state (Persistence)

Mặc định, state lưu trong memory và mất khi reload. Để lưu trữ:

### LocalStorage

```jsx
// Lưu khi state thay đổi
useEffect(() => {
  localStorage.setItem("columns", JSON.stringify(columns));
}, [columns]);

// Khôi phục khi load
const [columns, setColumns] = useState(() => {
  const saved = localStorage.getItem("columns");
  return saved ? JSON.parse(saved) : defaultColumns;
});
```

### Kết nối với Backend

```jsx
const handleNavigate = async (colId, action, name, state) => {
  // Update local state
  setColumns(newColumns);

  // Sync with server
  await fetch("/api/dashboard/state", {
    method: "POST",
    body: JSON.stringify({ columns: newColumns }),
  });
};
```

---

## 🐛 Xử lý lỗi thường gặp

### 1. "Cannot read property 'componentName' of undefined"

**Nguyên nhân:** Navigation history bị rỗng

**Fix:**

```jsx
const current = navigation.history[navigation.currentIndex];
if (!current) return <div>Loading...</div>;
```

### 2. Drag không hoạt động

**Nguyên nhân:** Thiếu `activationConstraint`

**Fix:**

```jsx
useSensor(PointerSensor, {
  activationConstraint: { distance: 5 }, // ← Quan trọng!
});
```

### 3. Component không re-render

**Nguyên nhân:** Mutate state trực tiếp

**Fix:**

```jsx
// ❌ Sai
columns[0].navigation = newNav;

// ✅ Đúng
setColumns((prev) =>
  prev.map((col) =>
    col.id === targetId ? { ...col, navigation: newNav } : col
  )
);
```

---

## 📚 Tích hợp với hệ thống hiện có

### Với React Router

```jsx
import { useNavigate } from "react-router-dom";

const PostCard = ({ onNavigate, postId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Nếu trong Dashboard (có onNavigate), dùng internal routing
    if (onNavigate) {
      onNavigate("PostDetail", { postId });
    }
    // Nếu không, dùng React Router
    else {
      navigate(`/posts/${postId}`);
    }
  };

  return <div onClick={handleClick}>...</div>;
};
```

### Với React Query

```jsx
import { useQuery } from "@tanstack/react-query";

const PostDetail = ({ state }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["post", state?.postId],
    queryFn: () => fetchPost(state.postId),
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{data.title}</div>;
};
```

---

## 🎯 Use Cases

- **Social Media Dashboard**: Multi-timeline viewer (Home, Notifications, Messages)
- **Admin Panel**: Quản lý nhiều module cùng lúc
- **Project Management**: Theo dõi nhiều tasks/boards
- **E-commerce**: So sánh sản phẩm side-by-side
- **Analytics**: Xem nhiều reports cùng lúc

---

## 🤝 Contributing

1. Fork repository
2. Tạo branch: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m 'Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Mở Pull Request

---

## 📝 License

MIT License - Tự do sử dụng cho dự án cá nhân và thương mại.

---

## 👨‍💻 Author

**trungdang2309**

- GitHub: [@trungdang2309](https://github.com/trungdang2309)
- Made with ❤️ using React, dnd-kit & Tailwind CSS

---

## 🙏 Credits

- [dnd-kit](https://dndkit.com/) - Drag and drop library
- [SimpleBar](https://github.com/Grsmto/simplebar) - Custom scrollbar
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi:

1. Mở [Issue](https://github.com/trungdang2309/dnd-route-test/issues)
2. Xem [Live Demo](#) để hiểu rõ hơn
3. Đọc lại phần [Dev Instructions](#) trong UI

---

**⭐ Nếu project hữu ích, hãy cho một star!**
