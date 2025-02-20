# 文件模块
::: info FileManagement
Abp 提供了BLOB存储,文件管理模块将这些provider联合起来,实现了文件上传,下载,删除.
:::

## 如何集成
- 在对应的层添加对应的引用
- 添加 DependsOn(typeof(FileManagementXxxModule)) 特性到对应模块
    - Lion.AbpPro.FileManagement.Application
    - Lion.AbpPro.FileManagement.Application.Contracts
    - Lion.AbpPro.FileManagement.Domain
    - Lion.AbpPro.FileManagement.Domain.Shared
    - Lion.AbpPro.FileManagement.EntityFrameworkCore
    - Lion.AbpPro.FileManagement.HttpApi
    - Lion.AbpPro.FileManagement.HttpApi.Client
- 在自己的dbcontext中实现接口：IFileManagementDbContext
- 在 EntityFrameworkCore 层添加数据库配置在 AbpProDbContext.cs 的 OnModelCreating()方法中添加 builder.ConfigureFileManagement();

## 存储方式

### FileSystem
- Abp Pro默认采用此方式
1. 添加Volo.Abp.BlobStoring.FileSystem引用
2. 添加[DependsOn(typeof(AbpBlobStoringFileSystemModule))]依赖
3. 配置，在http.host的module下添加一下配置

```csharp
Configure<AbpBlobStoringOptions>(options =>
{
    options.Containers.ConfigureDefault(container =>
    {
        container.UseFileSystem(fileSystem =>
        {
            // 指定文件保存路径
            fileSystem.BasePath = "C:\\my-files";
        });
    });
});

```

### Aliyun Provider
- 使用阿里云oss
1. 添加Volo.Abp.BlobStoring.Aliyun引用
2. 添加[DependsOn(typeof(AbpBlobStoringAliyunModule))]依赖
3. 配置，在http.host的module下添加一下配置

```csharp
Configure<AbpBlobStoringOptions>(options =>
{
    options.Containers.ConfigureDefault(container =>
    {
        container.UseAliyun(aliyun =>
        {
            aliyun.AccessKeyId = "your aliyun access key id";
            aliyun.AccessKeySecret = "your aliyun access key secret";
            aliyun.Endpoint = "your oss endpoint";
            aliyun.RegionId = "your sts region id";
            aliyun.RoleArn = "the arn of ram role";
            aliyun.RoleSessionName = "the name of the certificate";
            aliyun.Policy = "policy";
            aliyun.DurationSeconds = "expiration date";
            aliyun.ContainerName = "your aliyun container name";
            aliyun.CreateContainerIfNotExists = true;
        });
    });
});

```

### Azure Provider
- 使用Azure oss
1. 添加Volo.Abp.BlobStoring.Azure
2. 添加[DependsOn(typeof(AbpBlobStoringAzureModule))]依赖
3. 配置，在http.host的module下添加一下配置

```csharp
Configure<AbpBlobStoringOptions>(options =>
{
    options.Containers.ConfigureDefault(container =>
    {
        container.UseAzure(azure =>
        {
            azure.ConnectionString = "your azure connection string";
            azure.ContainerName = "your azure container name";
            azure.CreateContainerIfNotExists = true;
        });
    });
});

```

### Minio Provider
- 使用Minio
1. 添加Volo.Abp.BlobStoring.Minio
2. 添加[DependsOn(typeof(AbpBlobStoringMinioModule))]依赖
3. 配置，在http.host的module下添加一下配置

```csharp
Configure<AbpBlobStoringOptions>(options =>
{
    options.Containers.ConfigureDefault(container =>
    {
        container.UseMinio(minio =>
        {
            minio.EndPoint = "your minio endPoint";
            minio.AccessKey = "your minio accessKey";
            minio.SecretKey = "your minio secretKey";
            minio.BucketName = "your minio bucketName";
        });
    });
});
```

### Aws Provider
- 使用Aws
1. 添加Volo.Abp.BlobStoring.Aws
2. 添加[DependsOn(typeof(AbpBlobStoringAwsModule))]依赖
3. 配置，在http.host的module下添加一下配置

```csharp
Configure<AbpBlobStoringOptions>(options =>
{
    options.Containers.ConfigureDefault(container =>
    {
        container.UseAws(Aws =>
        {
            Aws.AccessKeyId = "your Aws access key id";
            Aws.SecretAccessKey = "your Aws access key secret";
            Aws.UseCredentials = "set true to use credentials";
            Aws.UseTemporaryCredentials = "set true to use temporary credentials";
            Aws.UseTemporaryFederatedCredentials = "set true to use temporary federated credentials";
            Aws.ProfileName = "the name of the profile to get credentials from";
            Aws.ProfilesLocation = "the path to the aws credentials file to look at";
            Aws.Region = "the system name of the service";
            Aws.Name = "the name of the federated user";
            Aws.Policy = "policy";
            Aws.DurationSeconds = "expiration date";
            Aws.ContainerName = "your Aws container name";
            Aws.CreateContainerIfNotExists = true;
        });
    });
});
```

### Google Provider
- 使用Google
1. 添加Volo.Abp.BlobStoring.Google 
2. 添加[DependsOn(typeof(AbpBlobStoringGoogleModule))]依赖
3. 配置，在http.host的module下添加一下配置

```csharp
Configure<AbpBlobStoringOptions>(options =>
{
    options.Containers.ConfigureDefault(container =>
    {
        container.UseGoogle(google =>
        {
            google.ClientEmail = "your coogle client email";
            google.ProjectId = "your coogle project id";
            google.PrivateKey = "your coogle private key";
            google.Scopes = "your coogle scopes";
            google.ContainerName = "your coogle container name";
            google.CreateContainerIfNotExists = true;
            //google.UseApplicationDefaultCredentials = true; // If you want to use application default credentials
        });
    });
});

```

### Database Provider
- 使用Google
1. 添加Volo.Abp.BlobStoring.Database 
2. 添加[DependsOn(typeof(AbpBlobStoringDatabaseModule))]依赖
3. 使用数据库Provider,需要安装一下模块,并且执行ef迁移
- Volo.Abp.BlobStoring.Database.Domain.Shared
- Volo.Abp.BlobStoring.Database.Domain
- Volo.Abp.BlobStoring.Database.EntityFrameworkCore
- Volo.Abp.BlobStoring.Database.Mysql
4. 配置，在http.host的module下添加一下配置

```csharp
Configure<AbpBlobStoringOptions>(options =>
{
    options.Containers.ConfigureDefault(container =>
    {
        container.UseDatabase();
    });
});
```

### 自定义Provider
1. 实现BlobProviderBase
```csharp
using System.IO;
using System.Threading.Tasks;
using Volo.Abp.BlobStoring;
using Volo.Abp.DependencyInjection;

namespace AbpDemo
{
    public class MyCustomBlobProvider : BlobProviderBase, ITransientDependency
    {
        public override Task SaveAsync(BlobProviderSaveArgs args)
        {
            //TODO...
        }

        public override Task<bool> DeleteAsync(BlobProviderDeleteArgs args)
        {
            //TODO...
        }

        public override Task<bool> ExistsAsync(BlobProviderExistsArgs args)
        {
            //TODO...
        }

        public override Task<Stream> GetOrNullAsync(BlobProviderGetArgs args)
        {
            //TODO...
        }
    }
}

```
2. 配置
```csharp
Configure<AbpBlobStoringOptions>(options =>
{
    options.Containers.ConfigureDefault(container =>
    {
        container.ProviderType = typeof(MyCustomBlobProvider);
    });
});
```
3. 添加扩展方法
```csharp
public static class MyBlobContainerConfigurationExtensions
{
    public static BlobContainerConfiguration UseMyCustomBlobProvider(
        this BlobContainerConfiguration containerConfiguration)
    {
        containerConfiguration.ProviderType = typeof(MyCustomBlobProvider);
        return containerConfiguration;
    }
}
```
4. 配置options
```csharp
Configure<AbpBlobStoringOptions>(options =>
{
    options.Containers.ConfigureDefault(container =>
    {
        container.UseMyCustomBlobProvider();
    });
});
```