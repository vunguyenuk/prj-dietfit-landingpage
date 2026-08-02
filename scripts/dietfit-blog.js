(function () {
  "use strict";

  const posts = [
    {
      slug: "doc-nhan-dinh-duong-tren-bua-an",
      category: "Dinh dưỡng",
      date: "02.08.2026",
      author: "Đội ngũ DietFit",
      title: "Đọc nhãn dinh dưỡng mà không cần thuộc lòng mọi con số",
      deck: "Ba thông tin đủ giúp bạn hiểu nhanh một món ăn có hợp với mục tiêu hôm nay hay không.",
      image: "../assets/blog/blog-01.webp",
      body: [
        ["p", "Nhãn dinh dưỡng thường trông như một bảng số liệu dày đặc. Nhưng để đưa ra lựa chọn hằng ngày, bạn không cần phân tích tất cả. Hãy bắt đầu bằng khẩu phần, tổng năng lượng và nhóm chất chính."],
        ["h2", "Bắt đầu từ khẩu phần"],
        ["p", "Một gói có thể chứa nhiều hơn một khẩu phần. Nếu bạn ăn hết gói, lượng calo và dinh dưỡng cũng cần được nhân tương ứng. Đây là chi tiết nhỏ nhưng thường tạo ra khác biệt lớn nhất."],
        ["h2", "Nhìn vào bức tranh, không phán xét một món"],
        ["p", "Một món nhiều năng lượng không tự động trở thành món xấu. Điều quan trọng là nó nằm ở đâu trong tổng thể ngày ăn, mức vận động và mục tiêu của bạn."],
        ["quote", "Dữ liệu tốt nhất là dữ liệu giúp bạn quyết định dễ hơn, không phải khiến bạn lo hơn."],
        ["p", "DietFit gom những con số quan trọng vào cùng một màn hình để bạn kiểm tra nhanh, sau đó tiếp tục tận hưởng bữa ăn của mình."]
      ]
    },
    {
      slug: "bien-y-tuong-thanh-thoi-quen-an-uong",
      category: "Thói quen",
      date: "29.07.2026",
      author: "Mai Nguyễn",
      title: "Biến ý định ăn khỏe thành một kế hoạch thật sự làm được",
      deck: "Một kế hoạch tốt không bắt bạn sống hoàn hảo. Nó chỉ cần đủ rõ để bạn biết bước tiếp theo.",
      image: "../assets/blog/blog-02.webp",
      body: [["p", "Mục tiêu càng mơ hồ, việc bắt đầu càng khó. Thay vì nói “từ mai ăn lành mạnh”, hãy chọn một hành động có thể nhìn thấy và lặp lại."], ["h2", "Thiết kế cho ngày bận rộn"], ["p", "Chuẩn bị sẵn hai hoặc ba lựa chọn quen thuộc giúp bạn bớt phải quyết định khi mệt. Kế hoạch thực tế luôn có chỗ cho những ngày không đúng dự kiến."], ["h2", "Theo dõi vừa đủ"], ["p", "Ghi nhận bữa ăn giúp bạn thấy xu hướng. Đừng biến nó thành bài kiểm tra đúng sai; hãy dùng nó như chiếc gương để điều chỉnh."], ["quote", "Sự đều đặn nhẹ nhàng thường đi xa hơn một tuần cố gắng thật căng."], ["p", "Khi hành động nhỏ đủ dễ để lặp lại, kết quả lớn sẽ xuất hiện theo thời gian."]]
    },
    {
      slug: "giam-can-khong-phai-chuyen-mot-nguoi",
      category: "Cộng đồng",
      date: "23.07.2026",
      author: "Cộng đồng DietFit",
      title: "Hành trình thay đổi không nhất thiết phải đi một mình",
      deck: "Một lời hỏi thăm đúng lúc hoặc một nhóm bạn cùng mục tiêu có thể làm mọi thứ nhẹ hơn.",
      image: "../assets/blog/blog-03.webp",
      body: [["p", "Thay đổi thói quen là công việc cá nhân, nhưng môi trường xung quanh ảnh hưởng rất nhiều đến khả năng duy trì."], ["h2", "Chia sẻ để giảm áp lực"], ["p", "Khi bạn kể về một ngày chưa như ý và nhận lại sự thấu hiểu, cảm giác thất bại sẽ bớt nặng. Bạn có thể quay lại nhịp cũ nhanh hơn."], ["h2", "Tìm người đồng hành phù hợp"], ["p", "Người đồng hành tốt không kiểm soát bữa ăn của bạn. Họ nhắc bạn nhìn vào tiến trình dài hạn và tôn trọng tốc độ riêng."], ["quote", "Cộng đồng tốt không tạo thêm áp lực; cộng đồng tốt giúp bạn có thêm chỗ để thở."], ["p", "Các cộng đồng DietFit là nơi bạn có thể hỏi, chia sẻ và học từ trải nghiệm thật của nhau."]]
    },
    {
      slug: "theo-doi-giup-thay-doi-nhanh-hon",
      category: "Tiến độ",
      date: "18.07.2026",
      author: "Minh Anh",
      title: "Vì sao theo dõi đúng cách giúp bạn thay đổi nhanh hơn",
      deck: "Không phải vì bạn kiểm soát nhiều hơn, mà vì bạn nhìn thấy điều gì đang thực sự xảy ra.",
      image: "../assets/blog/blog-04.webp",
      body: [["p", "Trí nhớ của chúng ta thường ghi lại những ngày đặc biệt và bỏ qua những hành động nhỏ lặp lại. Theo dõi giúp lấp khoảng trống đó."], ["h2", "Xu hướng quan trọng hơn một con số"], ["p", "Cân nặng có thể dao động do nước, muối, giấc ngủ và nhiều yếu tố khác. Một đường xu hướng vài tuần có ý nghĩa hơn kết quả của một buổi sáng."], ["h2", "Dữ liệu để điều chỉnh"], ["p", "Nếu tiến độ chậm, dữ liệu cho bạn một điểm xuất phát để thay đổi khẩu phần, vận động hoặc giấc ngủ thay vì đoán."], ["quote", "Theo dõi không phải để chấm điểm bản thân. Theo dõi để hiểu bản thân."], ["p", "Chọn một vài chỉ số liên quan trực tiếp đến mục tiêu và kiểm tra chúng theo nhịp phù hợp với bạn."]]
    },
    {
      slug: "chat-luong-bua-an-tu-nhung-cuoc-tro-chuyen",
      category: "Lối sống",
      date: "12.07.2026",
      author: "Thảo Vy",
      title: "Một cuộc trò chuyện có thể thay đổi chất lượng bữa ăn",
      deck: "Khi hiểu lý do đằng sau lựa chọn của mình, bạn dễ tìm được giải pháp phù hợp hơn.",
      image: "../assets/blog/blog-05.webp",
      body: [["p", "Nhiều quyết định ăn uống không bắt đầu từ cơn đói. Chúng liên quan đến thời gian, cảm xúc, lịch làm việc và những người xung quanh."], ["h2", "Hỏi trước khi sửa"], ["p", "Thay vì lập tức cắt bỏ một món, hãy hỏi điều gì khiến bạn chọn nó. Có thể vấn đề nằm ở việc thiếu thời gian chuẩn bị hoặc một ngày làm việc quá dài."], ["h2", "Tìm giải pháp vừa với đời sống"], ["p", "Một thay đổi nhỏ nhưng phù hợp lịch sinh hoạt sẽ hữu ích hơn một thực đơn lý tưởng mà bạn không thể duy trì."], ["quote", "Câu hỏi đúng thường có giá trị hơn một danh sách quy tắc dài."], ["p", "Hãy dùng dữ liệu bữa ăn như điểm bắt đầu cho cuộc trò chuyện tử tế với chính mình."]]
    },
    {
      slug: "xay-niem-tin-voi-co-the",
      category: "Tâm lý",
      date: "05.07.2026",
      author: "Đội ngũ DietFit",
      title: "Xây lại niềm tin với cơ thể qua những tín hiệu nhỏ",
      deck: "Ăn uống bền vững bắt đầu khi bạn vừa hiểu dữ liệu, vừa lắng nghe cảm giác thật của mình.",
      image: "../assets/blog/blog-06.webp",
      body: [["p", "Cơ thể liên tục gửi tín hiệu về đói, no, năng lượng và căng thẳng. Những tín hiệu ấy có thể bị che lấp khi chúng ta quá bận hoặc theo đuổi quy tắc cứng nhắc."], ["h2", "Dừng lại trong vài giây"], ["p", "Trước và sau bữa ăn, thử nhận biết mức đói, cảm giác hài lòng và năng lượng. Không cần ghi chép dài; một quan sát ngắn cũng đủ."], ["h2", "Kết hợp cảm giác với dữ liệu"], ["p", "Dữ liệu dinh dưỡng cho bạn bối cảnh. Cảm giác cơ thể cho bạn phản hồi. Hai nguồn thông tin này bổ sung cho nhau."], ["quote", "Mục tiêu không phải ăn hoàn hảo, mà là ngày càng hiểu điều gì phù hợp với mình."], ["p", "Sự tin tưởng được xây từ nhiều lần quan sát và điều chỉnh nhỏ, không phải từ một quyết định duy nhất."]]
    }
  ];

  function postUrl(post) { return "./post.html?slug=" + encodeURIComponent(post.slug); }

  const grid = document.querySelector("[data-blog-grid]");
  if (grid) {
    grid.innerHTML = posts.map(function (post) {
      return '<a class="dietfit-blog-card" href="' + postUrl(post) + '">' +
        '<div class="dietfit-blog-card-media"><img src="' + post.image + '" alt="" loading="lazy"></div>' +
        '<div class="dietfit-blog-card-meta"><time>' + post.date + '</time></div>' +
        '<h3>' + post.title + '</h3>' +
        '<div class="dietfit-blog-card-author"><img src="../assets/images/dietfit-app-icon.png" alt=""><span>Bởi ' + post.author + '</span></div></a>';
    }).join("");
  }

  const postRoot = document.querySelector("[data-blog-post]");
  if (!postRoot) return;
  const slug = new URLSearchParams(window.location.search).get("slug");
  const index = Math.max(0, posts.findIndex(function (item) { return item.slug === slug; }));
  const post = posts[index];
  document.title = post.title + " — DietFit";
  document.querySelector("[data-post-meta]").textContent = post.date;
  document.querySelector("[data-post-title]").textContent = post.title;
  const author = document.querySelector("[data-post-author]");
  if (author) author.textContent = post.author;
  const image = document.querySelector("[data-post-image]");
  image.src = post.image;
  image.alt = post.title;
  document.querySelector("[data-post-body]").innerHTML = post.body.map(function (block) {
    if (block[0] === "h2") return "<h2>" + block[1] + "</h2>";
    if (block[0] === "quote") return "<blockquote>" + block[1] + "</blockquote>";
    return "<p>" + block[1] + "</p>";
  }).join("");
  const relatedGrid = document.querySelector("[data-related-posts]");
  if (relatedGrid) {
    const related = [1, 2, 3].map(function (offset) {
      return posts[(index + offset) % posts.length];
    });
    relatedGrid.innerHTML = related.map(function (item) {
      return '<a class="dietfit-blog-card" href="' + postUrl(item) + '">' +
        '<div class="dietfit-blog-card-media"><img src="' + item.image + '" alt="" loading="lazy"></div>' +
        '<div class="dietfit-blog-card-meta"><time>' + item.date + '</time></div>' +
        '<h3>' + item.title + '</h3>' +
        '<div class="dietfit-blog-card-author"><img src="../assets/images/dietfit-app-icon.png" alt=""><span>Bởi ' + item.author + '</span></div></a>';
    }).join("");
  }
})();
