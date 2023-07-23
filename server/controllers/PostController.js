import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';

export const getByTag = async (req, res) => {
    try {
        const tagName = req.params.name;
        const posts = await PostModel.find();

        const filteredPosts = posts
            .filter((obj) => obj.tags.includes(tagName));

        res.json(filteredPosts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить посты',
        });
    }
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить тэги',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOne({
            _id: postId
        }).populate('user');

        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }

        post.viewsCount += 1; // Increment the viewsCount field by 1

        await post.save(); // Save the updated post

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const user = await UserModel.findById(req.userId);

        const comment = {
            text: req.body.comment,
            user: {
                fullName: user.fullName,
                avatarUrl: user.avatarUrl
            }
        };

        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        post.comments.push(comment);
        await post.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};


export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = await PostModel.findOneAndDelete({
            _id: postId
        });

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json({
            success: true,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.trim().split(','),
            user: req.userId,
            comments: []
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId,
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tags: req.body.tags.split(','),
        }, );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};