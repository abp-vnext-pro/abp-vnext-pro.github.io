---
sidebar:
  sort: 8
---

## 集成Dapper
1. 在EntityFrameworkCore层添加Volo.Abp.Dapper包引用
2. 在EntityFrameworkCore层添加AbpDapperModule模块依赖
3. 在domain层定义接口IPersonDapperRepository
```csharp
public interface IPersonDapperRepository
{
    Task<List<string>> GetAllPersonNamesAsync();

    Task<int> UpdatePersonNamesAsync(string name);

}
```
4. 在EntityFrameworkCore层实现接口
```csharp
public class PersonDapperRepository : DapperRepository<MyAppDbContext>, ITransientDependency, IPersonDapperRepository
{
    public PersonDapperRepository(IDbContextProvider<MyAppDbContext> dbContextProvider)
        : base(dbContextProvider)
    {
    }

    public virtual async Task<List<string>> GetAllPersonNamesAsync()
    {
        var dbConnection = await GetDbConnectionAsync();
        return (await dbConnection.QueryAsync<string>(
            "select Name from People",
            transaction:  await GetDbTransactionAsync())
        ).ToList();
    }

    public virtual async Task<int> UpdatePersonNamesAsync(string name)
    {
        var dbConnection = await GetDbConnectionAsync();
        return await dbConnection.ExecuteAsync(
            "update People set Name = @NewName",
            new { NewName = name },
            await GetDbTransactionAsync()
        );
    }
}

```
5. 在使用的地方注入IPersonDapperRepository接口即可使用。