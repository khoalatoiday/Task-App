Tổng hợp những gì đã học được về task-app

- Công cụ MongoDB để set up databse và thư viện mongoDB: mongoDB npm (mongoDB.js)
+ Mở database: path of mongod.exe --dbpath=path of mongodb-data
+ MongoDB là cách tổ chức dữ liệu dưới dạng là NoSQL (No Structure Query Language): Collection(tương ứng table), document(tương ứng record), field(column) có dạng JSON format

- Connect MongoDB với nodeJS: sử dụng tool Robo 3T đế set up và sử dụng database với MongoClient và cũng có 2 cách kết nối (với callback hoặc Promise) ~ trong VD ta sử dụng callback

- Các API MongoDB đều là asynchronous  và  trả về PROMISE  nếu không có callback là agru thứ 2 
+ Insert document (Tất cả document đều có 1 object đặc biệt là ObjectId, nếu không thêm ObjectId thì mongoDB sẽ tự động tạo ra và thêm vào): InsertOne trả về InsertOneResult, InsertMany trả về InsertManyResult
+ Tìm document: 
    + findOne({filter: value,..}) trả về document(TSchema) khớp filter đầu tiên ,
    + find({filter: value,..}) trả về con trỏ trỏ vào dữ liệu(FindCursor) khớp với filter và từ con trỏ đó ta có các API của find xử lý dữ liệu được trỏ như là count, toArray, hasNext(), for await, forEach
+  Update document:
    + updateOne({filter:value,..}, {UpdateFilter:{key:value}, ..}): trả về UpdateResult, update document
    + updateMany({filter:value,..}, {UpdateFilter:{key:value}, ..}): trả về UpdateResult, update nhiều document
    + UpdateFilter thường dùng là: $set (thay đổi giá trị field của mongoDB), $inc(tăng giá trị 1 field của mongoDB), $rename(thay đổi tên field của mongoDB), $unset(xóa field của mongoDB), $mul (nhân giá trị field của mongoDB với 1 số)
+ Delete document:
    + deleteOne({filter:value,..}): trả về DeleteResult, xóa 1 document khớp với filter
    + deleteMany({filter:value,..}): trả về DeleteResult, xóa nhiều documents khớp với filter
-> Lưu ý khi xử lí với ObjectId ta phải truyền vào dạng {_id: new ObjectId("id cần tìm")}, với ObjectId là API của mongoDB

----------------------------------------------------------------------------------------------------------------------------------------

- Mongoose: tool với các MongooseAPI dùng để quản lý mongoDB tuyệt vời với các feature bên cạnh việc chỉ CRUD document đơn thuần, mongoose giúp set up validation cho document,set up authentication, set up required hay optional field, set up kiểu loại data mà dev mong muốn và nhiều thứ khác. Do API của Mongoose đều return Promise nên ta sẽ sử dụng then/catch hoặc async/await(nên dùng và truy cập lỗi với ngoại lệ try{}/catch(error){...}).Trong trường hợp dùng callback thì sẽ trả về Query, với Query thì sẽ trả về undefined mà không bắt lỗi ở catch nên ta sẽ bắt lỗi bằng câu điều kiện if, ?, ===; catch chỉ bắt lỗi server của await Query trong trường hợp này. 

-> 2 npm nổi tiếng nhất của nodejs là express tạo khung ứng dụng web phát triển web,app di động và mongoose để kết nối với cơ sở dữ liệu

- Connect mongoose với mongoDB: connect(uri, {options}), require tại file app.js (db/mongoose.js, app.js)

- Tạo model hay constructor bởi moongoose được biên dịch trong mongoDB. Một instance của model được gọi là một document trong mongoDB : model("nameOfCollection", Schema) với Schema là 1 Object chứa các field tương ứng trong field của collection trong mongoDB. Mỗi field (Object) sẽ có các cặp SchemaType-value và chúng sẽ set up mô hình cho Schema đó . Tạo SchemaObject với Mongoose.Schema({field:{SchemaType:...}}) (model/user.js, model/task.js)
    + Set up kiểu cho field với SchemaType "type", set validation cho field với SchemaType "required" 
    + Set up customer validation cho field với SchemaType là function validate(value){...} với value là giá trị của field, có thể sử dụng thêm validator npm để set up phức tạp hơn
    + Một số SchemaType khác là: trim() ~ xóa khoảng trắng ở giữa, lowercase, uppercase, default, min, max, minlength, maxlength, unique để tạo giá trị field khác nhau
- InstanceOfModel.save() trả về Promise: lưu instance vào mongoDB (sử dụng then/catch hoặc async/await)
- InstanceOfModel.remove() trả về Promise: xóa instance trong mongoDB (sử dụng then/catch hoặc async/await)

- REST API: Representational State Tranfer API, API là tool, là những tên hàm đã viết sẵn của thư viện bên thứ 3 để ta sử dụng. REST API Application là 1 App cho phép client truy cập và sử dụng Mô hình dữ liệu từ một resource nào đó và thực hiện các predefined operations(có thể là CRUD model) 
- REST API là các API giúp ta tạo ra 1 app thỏa mãn các tiêu chí: làm việc với mô hình dữ liệu (Representation) của database, nhận  request(HTTP request) từ client và khi data trả về server, xử lý data tại server, và App chuyển trạng thái (state từ server tranfer(đến) client) trả về response(HTTP response) cho client. Một HTTP Request gồm 2 phần: HTTP Methods và path(route). Một HTTP Request chỉ là 1 đoạn text  với phần 1 là header chứa các thông tin như meta-data(Kiểu của kiểu dữ liệu), Authotication và phần 2 là body (dữ liệu và dạng của chúng được accept ~ thường là JSON Format). Một HTTP Response tương tự

- Express cung cấp API để tạo path/route cho app là app.nameOfMethodHTTP. VD: app.post("/path", async()=>{await}),... nếu sử dụng asynchronous code thì dùng async/await còn không dùng arrow function bình thường. Ta cần biết client sẽ gửi data dạng gì và cho phép app express cho phép sử dụng dạng đó. VD nếu client gửi data dạng JSON Format => app cần cho phép sử dụng JSON Format với: app.use(express.json()) tự động chuyển đổi JSON Format sang Object, request body thường là JSON Format  (app.js). Lấy request body với req.body, trả response với status và body cho client với res.status().send(body)
- Tạo các route cho REST API App: Sau khi nhận request body xong thì phải (router/task.js, router/user.js)
    + Create model: HTTP POST, tạo xong instanceOfModel thì dùng API Mongoose là instanceOfModel.save() để lưu vào mongoDB 
    + Read model: HTTP GET, fetch by id: express cung cấp route parameter cho route với /:nameOfParam và truy cập vào param với req.params.nameOfParam
    + Update model: HTTP PATCH, một số API để update như findByIdAndUpdate(id,req.body,optional), findOneAndUpdate({filter: value}, req.body, optional). Nếu update field mà không có trong collection thì mongoose không bắt lỗi mà sẽ lờ đi, do vậy muốn bắt lỗi ta phải chỉ rõ những field được phép update [], field được update trong req.body [], kiểm tra xem field được update có chứa trong field được phép update không và bắt lỗi trong câu điều kiện
    + Delete model: HTTP DELETE, một số API để delete như findByIdAndDelete(id), findOneAndDelete({filter:value})
    + Login: HTTP POST

----------------------------------------------------------------------------------------------------------------------------------------

Set Auuthentication và security
    
- Hashing Password: tạo secure password, các API trả về Promise Resolve Value nếu không có callback
    + Sử dụng npm bcrypt với các API: await bcrypt.hash(password,8) tạo hashing password,  (playground/hashing-password.js). Hàm tạo hash là hàm 1 chiều tức chỉ có 1 chiều password -> hashing text
    + Kiểm tra hashing password: await bcrypt.compare(password, hashPassword), lưu ý khi truyền agru password, ta phải nhớ có các điều kiện đặc biệt như có lowercase, uppercase không vì password để compare phải giống hoàn toàn với password trong mongoDB
    + set up middleware Mongoose: ta sẽ tạo hàm middleware cho Schema. có nhiều loại middleware trong đó phổ biến là "pre" (kích hoạt middleware trước 1 event) và "post"(kích hoạt middleware sau 1 event). Hàm middleware có 1 agru là next và trong body cũng gọi next() ở cuối cùng có ý nghĩa là sẽ gọi và kích hoạt event. VD: Schema.pre("nameOfAPImongooseEvent", async function (next){ ...  next() }). Thường ta dùng core function vì có thể dùng từ khóa "this" để trỏ Schema

- Tạo các hàm bổ trợ cho Schema với Schema.methods.nameOfMethod = async () =>{body} hoặc Schema.statics.nameOfMethod = async () =>{body}. Hàm Statics có thể được gọi bởi chính Schema mà không cần Instace of Schema

- Set Authentication:
    + JSON Web Tokens npm: dùng để tạo các token đại diện cho các bên client và server thuận tiện, an toàn. Chỉ khi token của client tồn tại thì server mới xác thực với client và thực hiện tác vụ: Tạo token của Object||String với JWT.sign(Object|| String, privateKey, [optional ,callback]) với optional là {key:value}, callback nếu sử dụng asynchronous code. Xác thực token với JWT.verify(token, privateKey) trả về Object||String tạo ra token (playground/manage-authentication.js). VD: sử dụng token của _id để lưu trạng thái login của user (model/user.js)
    + Set up middlerware Express: nếu có middleware thì sau khi khi client gửi request thì hàm middleware được kích hoạt rồi mới chạy router. Cũng giống như middleware Mongoose, hàm middleware express ngoài 2 agru là req,res còn có 1 agru là next, khi next() được gọi cuối cùng nghĩa là đã có thể gọi router handler. Hàm middleware express sẽ là agru thứ 2 của app.use() hoặc router.method(path,). Nếu nó là agru 1 thì tức hàm middleware express sẽ chạy với mọi router (auth/auth.js, router/user.js, router/task.js)
    + Khi gửi request, client sẽ gửi theo 1 token(nằm ở req.header("Authorization")) và server sẽ kiểm tra xem token đó có hợp lệ(đổi sang Object||String tạo ra token đó với JWT.verify() và kiểm tra xem Object||String đó có tồn tại trong mongoDB không?). Ta có thể tạo thêm property cho req bằng cách gọi req.nameOfProperty = ... (auth/auth.js)
    + Khi không muốn xác thực nữa thì xóa token đang xác thực đi

- toJSON Method của Schema, Object: Schema.method.toJSON = () =>{} , Object.toJSON = () =>{} thường sẽ trả về 1 Object chứa các thông tin mà dev muốn truy cập, xử lý hoặc hiện thị. Nó được tự động gọi khi JSON.stringify(Schema||Object) được gọi.Ở đây vì ta thường để express app có phép sử dụng JSON Format với req và res. Nên res.send(Object) thực chất là đã gọi JSON.stringify(Object) đã đưa ra message cho client ở dạng JSON Format
    + Lưu ý: Nó khác với hàm toJSON(Date Object) khi convert Date Object về JSON Format

- Trong mongoose có cung cấp 1 SchemaType của field là ref: "otherSchema" để kết nối với Schema khác ở collection khác. API mongoose populate với ref("Other Collection") để lấy dữ liệu liên kết giữa 2 hay nhiều Model với nhau và convert thành cả 1 Instance của "Other Collection" được ref(). syntax: await InstanceSchema.populate("field có chứa thông tin ref").execPopulate() trả về Instance Other Model được ref(). Populate là quá trình tạo giá trị các field bằng các document từ 1 collection khác
    + Tuy nhiên không phải lúc nào 2 Schema cũng ref() 2 Collection lẫn nhau cũng là điều tốt, thậm chí là bad design Schema. VD user tạo ra task vậy task cần chứa thông tin _id của user và có thể populate lại thành 1 instance User Model để lấy thông tin user. Nhưng user thì không cần thiết phải lưu toàn bộ thông tin tasks nó tạo ra trong collection. Vậy làm thế nào để user đọc được tất cả các tasks nó đã tạo mà không cần lưu vào collection -> Ta vẫn sẽ ref Task Collection với User Schema nhưng là ở vitural: Schema.virtual("nameOfVituralField", { ref: "Task", localField: "field của User Schema được liên kết(_id)", foreginField: "field của Task Schema được liên kết(owner)" }) 

- ES6 spread operator: object1 = {...object2} lấy toàn bộ key-value của object2 và cho vào object1, object1 hoàn toàn có thể overide lại các key-value 

- Sử dụng muler npm để upload File

