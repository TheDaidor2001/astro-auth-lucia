import { column, defineDb, defineTable } from 'astro:db';


const User = defineTable({
  columns: {
    id: column.text({primaryKey: true, optional: false, unique: true}),
    email: column.text({unique: true, optional: true}),
    password: column.text({optional: true}),
    username: column.text({optional: true}),
    github_id: column.text({optional: true, unique: true}),
  }
})

const Session = defineTable({
  columns: {
    id: column.text({optional: false, unique: true}),
    userId: column.text({optional: false, references: () => User.columns.id}),
    expiresAt: column.number({optional: false}),
  }
})

const Blog = defineTable({
  columns: {
    id: column.text({primaryKey: true, optional: false, unique: true}),
    title: column.text({optional: false}),
    subtitle: column.text({optional: true}),
    content: column.text({optional: false}),
    date: column.text(),
  }
})


// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    Session,
    Blog
  }
});
